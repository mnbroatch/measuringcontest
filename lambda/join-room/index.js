const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const { Client } = require('@mnbroatch/boardgame.io/client')
const { SocketIO } = require('@mnbroatch/boardgame.io/multiplayer')
const { ActivePlayers } = require('@mnbroatch/boardgame.io/core')
const jwt = require('jsonwebtoken');

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const ssmClient = new SSMClient({});
const BOARDGAME_SERVER_URL = 'https://gameserver.boardgameengine.com';

const RoomGame = {
  name: 'bgestagingroom',
  setup: (_, setupData) => ({
    players: { '1': { name: 'Room Creator' } },
    status: 'waiting',
    gameRules: '',
    gameName: '',
    ...setupData?.initialState,
  }),
  turn: {
    activePlayers: ActivePlayers.ALL,
  },
  moves: {
    join: ({G, playerID}, name) => {
      if (G.status === 'waiting') {
        G.players[playerID] = {
          name: name || G.players[playerID] || `Player ${playerID}`
        };
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
      if ((playerID === '0' || playerID === '1') && G.status === 'waiting') {
        G.gameRules = gameRules
        G.gameName = gameName
      }
    },
    gameCreated: ({G, playerID}, newGameId) => {
      if (playerID === '0' && G.status === 'waiting') {
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
    roomDeleted: ({G, playerID}) => {
      if (playerID === '0') {
        G.status = 'deleted';
      }
    },
  },
};

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
  
  // Fetch the room
  const roomResp = await ddb.send(
    new GetCommand({
      TableName: "measuringcontest-rooms",
      Key: { roomCode },
    })
  );
  
  if (!roomResp.Item) {
    throw new Error("Room not found");
  }
  
  const room = roomResp.Item;
  const roomGameId = room.roomGameId
  const jwtSecret = await getJwtSecret();
  
  const clientToken = jwt.sign({
    gameId: roomGameId,
    playerId: sub,
    purpose: 'gameserver-app'
  }, jwtSecret, { expiresIn: '30d' });

  // const systemClientToken = jwt.sign({
  //   gameId: roomGameId,
  //   playerId: 'System',
  //   purpose: 'gameserver-app'
  // }, jwtSecret, { expiresIn: '30d' });

  const existingPlayer = room.members && room.members[sub];
  if (existingPlayer) {
    return {
      ...existingPlayer,
      clientToken
    };
  }
  
  // Create single JWT that includes both server auth and player data
  const serverToken = jwt.sign({
    gameId: roomGameId,
    playerId: sub,
    purpose: 'gameserver-api'
  }, jwtSecret, { expiresIn: '30d' });

  let joinData;
  try {
    const joinResp = await fetch(`${BOARDGAME_SERVER_URL}/games/bgestagingroom/${roomGameId}/join`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serverToken}`
      },
      body: JSON.stringify({ 
        playerName: sub,
        data: {
          gameId: roomGameId,
          playerId: sub
        }
      }),
    });
    
    if (!joinResp.ok) {
      const text = await joinResp.text();
      roomClient.stop();
      throw new Error(`Boardgame server responded ${joinResp.status} ${joinResp.statusText}: ${text}`);
    }
    
    joinData = await joinResp.json();
  } catch (e) {
    console.error("Fetch error details:", e);
    return {
      error: e.message,
      stack: e.stack,
      cause: e.cause
    };
  }

  const boardgamePlayerID = joinData.playerID;
  
  let roomClient;
  let roomGameState;
  await new Promise((resolve, reject) => {
    roomClient = Client({
      game: RoomGame,
      multiplayer: SocketIO({ 
        server: BOARDGAME_SERVER_URL,
        socketOpts: {
          extraHeaders: {
            'User-Agent': 'BoardGameEngine-Lambda/1.0'
          },
          transports: ['websocket', 'polling']
        }
      }),
      matchID: room.roomGameId,
      playerID: boardgamePlayerID,
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

  roomClient.moves.join();
  roomClient.stop();
  
  await ddb.send(new UpdateCommand({
    TableName: "measuringcontest-rooms",
    Key: { roomCode },
    UpdateExpression: "SET members.#userId = :memberData",
    ExpressionAttributeNames: {
      "#userId": sub
    },
    ExpressionAttributeValues: {
      ":memberData": {
        boardgamePlayerID,
        joinedAt: Date.now()
      }
    }
  }));
  
  return {
    boardgamePlayerID,
    clientToken
  };
};
