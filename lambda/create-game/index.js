const jwt = require('jsonwebtoken');
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
    players: {},
    status: 'waiting',
    gameRules: '',
    gameName: '',
  }),
  turn: {
    activePlayers: ActivePlayers.ALL,
  },
  moves: {
    join: ({G, playerID}, name) => {
      if (!(playerID in G.players)) {
        G.players[playerID] = { name };
      }
    },
    gameCreated: ({G, playerID}, newGameId) => {
      if (playerID === '0') {
        G.gameId = newGameId;
        G.status = 'started';
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
    WithDecryption: true // Important for SecureString parameters
  }));
  
  cachedJwtSecret = response.Parameter.Value;
  return cachedJwtSecret;
}

exports.handler = async (event) => {
  const { sessionCode: roomCode } = event.pathParameters;
  const { sub } = event.requestContext.authorizer.claims;
  const body = JSON.parse(event.body);

  // Fetch the room
  const roomResp = await dynamoDb.send(
    new GetCommand({
      TableName: "measuringcontest-rooms",
      Key: { roomCode },
    })
  );

  if (!roomResp.Item) {
    throw new Error("Room not found"); // mapping template can map to 404
  }

  const room = roomResp.Item;
  if (room.createdBy !== sub) {
    throw new Error("Unauthorized"); // mapping template -> 403
  }

  if (!(sub in body.players)) {
    throw new Error("Game creator must be in game"); // mapping template -> 403
  }

  // Get JWT secret from Parameter Store
  const jwtSecret = await getJwtSecret();

  // Create JWT for server authentication
  const serverToken = jwt.sign({ purpose: 'gameserver-api' }, jwtSecret, { expiresIn: '1h' });

  const createResp = await fetch(`${BOARDGAME_SERVER_URL}/games/${body.gameName}/create`, {
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
    const text = await createResp.text(); // read body even on error
    throw new Error(`Boardgame server responded ${createResp.status} ${createResp.statusText}: ${text}`);
  }

  const createData = await createResp.json();
  const gameId = createData.matchID;

  const player = body.players[sub]

  const joinResp = await fetch(`${BOARDGAME_SERVER_URL}/games/${body.gameName}/${gameId}/join`, {
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
    throw new Error(`Boardgame server responded ${joinResp.status} ${joinResp.statusText}: ${text}`);
  }

  const clientToken = jwt.sign({
    gameId: room.roomGameId,
    playerId: 'System',
    purpose: 'gameserver-app'
  }, jwtSecret, { expiresIn: '30d' });

  let client
  const clientInitializationPromise = new Promise(resolve => {
    client = Client({
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
    })

    client.start();

    client.subscribe((state) => {
      if (state !== null) { // Wait for actual state
        console.log('state in subscribe', state)
        resolve()
      }
    })
  })

  // Update room with game info
  await dynamoDb.send(new UpdateCommand({
    TableName: "measuringcontest-rooms",
    Key: { roomCode },
    UpdateExpression: "SET gameId = :gameId, players = :players, gameCreatedAt = :gameCreatedAt, gameName = :gameName, gameRules = :gameRules",
    ExpressionAttributeValues: {
      ":gameId": gameId,
      ":gameCreatedAt": Date.now(),
      ":gameName": body.gameName,
      ":gameRules": JSON.stringify(body.gameRules),
      ":players": {
        ...body.players,
        [sub]: {
          ...body.players[sub],
          boardgamePlayerID: '0',
          joinedAt: Date.now(),
        }
      },
    },
    ConditionExpression: "attribute_exists(roomCode) AND attribute_not_exists(gameId)"
  }));

  await clientInitializationPromise

  console.log('client.moves', client?.moves)
  client.moves.gameCreated(gameId); // ?? Add this

  client.stop();

  return {
    gameId,
  };
};
