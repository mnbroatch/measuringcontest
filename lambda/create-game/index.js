const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const stableHash = require('stable-hash').default;
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const { Client } = require('boardgame.io/client')
const { SocketIO } = require('boardgame.io/multiplayer')
const { ActivePlayers } = require('boardgame.io/core')

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);
const ssmClient = new SSMClient({});

const BOARDGAME_SERVER_URL = 'https://gameserver.measuringcontest.com';

const RoomGame = {
  name: 'bgestagingroom',
  setup: () => ({
    players: { '1': { name: 'Room Creator' } },
    status: 'waiting',
    gameRules: '',
    gameName: '',
  }),
  turn: {
    activePlayers: ActivePlayers.ALL,
  },
  moves: {
    join: ({G, playerID}, name) => {
      if (G.status === 'waiting') {
        G.players[playerID] = { name };
      }
    },
    leave: ({G, playerID}) => {
      if (playerID !== '1') {
        delete G.players[playerID]
      }
    },
    kick: ({G, playerID}, targetPlayerID) => {
      if (playerID === '0' && targetPlayerID !== '1') {
        delete G.players[targetPlayerID];
      }
    },
    setGameMeta: ({G, playerID}, { gameRules, gameName }) => {
      if (playerID === '1') {
        G.gameRules = gameRules
        G.gameName = gameName
      }
    },
    gameCreated: ({G, playerID}, newGameId) => {
      if (playerID === '0') {
        G.gameId = newGameId;
        G.status = 'started';
      }
    },
    gameDeleted: ({G, playerID}) => {
      if (playerID === '0') {
        delete G.gameId;
        G.status = 'waiting';
      }
    },
  },
};

// Cache the JWT secret to avoid repeated SSM calls
let cachedJwtSecret = null;
async function getJwtSecret() {
  if (cachedJwtSecret) {
    return cachedJwtSecret;
  }
  
  const response = await ssmClient.send(new GetParameterCommand({
    Name: "/measuringcontest/boardgame-jwt-secret",
    WithDecryption: true
  }));
  
  cachedJwtSecret = response.Parameter.Value;
  return cachedJwtSecret;
}

exports.handler = async (event) => {
  const { sessionCode: roomCode } = event.pathParameters;
  const { sub } = event.requestContext.authorizer.claims;

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body
  const body = JSON.parse(rawBody);

  // Fetch the room
  const roomResp = await dynamoDb.send(
    new GetCommand({
      TableName: "measuringcontest-rooms",
      Key: { roomCode },
    })
  );

  const room = roomResp.Item;

  if (!room) {
    throw new Error("Room not found");
  }

  if (room.createdBy !== sub) {
    throw new Error("Unauthorized");
  }

  // Get JWT secret from Parameter Store
  const jwtSecret = await getJwtSecret();

  // Connect to RoomGame to get player names
  const clientToken = jwt.sign({
    gameId: room.roomGameId,
    playerId: 'System',
    purpose: 'gameserver-app'
  }, jwtSecret, { expiresIn: '30d' });

  let roomClient;
  let roomGameState;
  
  const roomStatePromise = new Promise((resolve, reject) => {
    roomClient = Client({
      game: RoomGame,
      multiplayer: SocketIO({ 
        server: BOARDGAME_SERVER_URL,
        socketOpts: {
          transports: ['websocket', 'polling']
        }
      }),
      matchID: room.roomGameId,
      playerID: '0',
      credentials: clientToken,
    });

    roomClient.start();

    roomClient.subscribe((state) => {
      if (state !== null) {
        roomGameState = state;
        resolve();
      }
    });

    // Add timeout
    setTimeout(() => reject(new Error('Timeout connecting to RoomGame')), 10000);
  });

  await roomStatePromise;

  // Map boardgame player IDs to user subs with names from RoomGame
  const players = Object.entries(roomGameState.G.players).reduce((acc, [boardgamePlayerID, playerData]) => {
    const [userSub] = Object.entries(room.members).find(([_, member]) => 
      member.boardgamePlayerID === boardgamePlayerID
    ) || [];
    
    return !!userSub
      ? {
        ...acc,
        [userSub]: { name: playerData.name }
      }
      : acc
  }, {});

  if (!(sub in players)) {
    roomClient.stop();
    throw new Error("Game creator must be in game");
  }

  let rulesObject
  try {
    rulesObject = JSON.parse(body.gameRules)
    validateRulesObject(rulesObject)
  } catch (e) {
    throw new Error('Invalid rules object: ' + e.message)
  }

  const rulesHash = crypto.createHash('sha256').update(stableHash(rulesObject)).digest('hex');

  // Create JWT for server authentication
  const serverToken = jwt.sign({ purpose: 'gameserver-api' }, jwtSecret, { expiresIn: '1h' });
  const createResp = await fetch(`${BOARDGAME_SERVER_URL}/games/${rulesHash}/create`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${serverToken}`
    },
    body: JSON.stringify({ 
      gameRules: body.gameRules,
    }),
  });

  if (!createResp.ok) {
    const text = await createResp.text();
    roomClient.stop();
    throw new Error(`Boardgame server responded ${createResp.status} ${createResp.statusText}: ${text}`);
  }

  const createData = await createResp.json();
  const gameId = createData.matchID;

  const player = players[sub];

  const joinResp = await fetch(`${BOARDGAME_SERVER_URL}/games/${rulesHash}/${gameId}/join`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${serverToken}`
    },
    body: JSON.stringify({ 
      playerName: player.name,
      playerID: '0',
      data: {
        ...player,
        gameId,
        playerId: sub
      }
    }),
  });

  if (!joinResp.ok) {
    const text = await joinResp.text();
    roomClient.stop();
    throw new Error(`Boardgame server responded ${joinResp.status} ${joinResp.statusText}: ${text}`);
  }

  // Update room with game info
  await dynamoDb.send(new UpdateCommand({
    TableName: "measuringcontest-rooms",
    Key: { roomCode },
    UpdateExpression: "SET gameId = :gameId, players = :players, gameCreatedAt = :gameCreatedAt, gameName = :gameName, gameRules = :gameRules, rulesHash = :rulesHash",
    ExpressionAttributeValues: {
      ":gameId": gameId,
      ":gameCreatedAt": Date.now(),
      ":gameName": body.gameName,
      ":gameRules": JSON.stringify(body.gameRules),
      ":rulesHash": rulesHash,
      ":players": {
        ...players,
        [sub]: {
          ...players[sub],
          boardgamePlayerID: '0',
          joinedAt: Date.now(),
        }
      },
    },
    ConditionExpression: "attribute_exists(roomCode) AND attribute_not_exists(gameId)"
  }));

  roomClient.moves.gameCreated(gameId);

  roomClient.stop();

  return {
    gameId,
  };
};

function validateRulesObject (rulesObject) {
  return true
}
