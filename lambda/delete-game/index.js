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
    throw new Error("Unauthorized - only room creator can delete game");
  }

  if (!room.gameId) {
    throw new Error("No active game to delete");
  }

  const jwtSecret = await getJwtSecret();
  const serverToken = jwt.sign({ purpose: 'gameserver-api' }, jwtSecret, { expiresIn: '1h' });

  // Connect to RoomGame to update status
  const clientToken = jwt.sign({
    gameId: room.roomGameId,
    playerId: 'System',
    purpose: 'gameserver-app'
  }, jwtSecret, { expiresIn: '30d' });

  let roomClient;
  const clientInitializationPromise = new Promise(resolve => {
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
        resolve();
      }
    });
  });

  await clientInitializationPromise;

  // Update RoomGame state to move back to waiting
  roomClient.moves.gameDeleted();

  // Update DynamoDB to remove game info
  await dynamoDb.send(new UpdateCommand({
    TableName: "measuringcontest-rooms",
    Key: { roomCode },
    UpdateExpression: "REMOVE gameId, gameCreatedAt, gameName, gameRules, rulesHash, players",
  }));

  roomClient.stop();

  return {
    success: true,
    message: "Game deleted and players returned to lobby"
  };
};
