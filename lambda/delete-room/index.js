const jwt = require('jsonwebtoken');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, TransactWriteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const { Client } = require('boardgame.io/client');
const { SocketIO } = require('boardgame.io/multiplayer');
const { ActivePlayers } = require('boardgame.io/core');

const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);
const ssmClient = new SSMClient({});

const BOARDGAME_SERVER_URL = 'https://gameserver.boardgameengine.com';
const ROOM_NOT_FOUND_ERROR_MESSAGE = 'Room not found.';
const ROOM_NOT_FOUND_ERROR_NAME = 'ROOM_NOT_FOUND_ERROR';
const UNAUTHORIZED_ERROR_MESSAGE = 'You are not authorized to delete this room.';
const UNAUTHORIZED_ERROR_NAME = 'UNAUTHORIZED_ERROR';

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
        delete G.players[playerID];
      }
    },
    kick: ({G, playerID}, targetPlayerID) => {
      if (playerID === '0' && targetPlayerID !== '1') {
        delete G.players[targetPlayerID];
      }
    },
    setGameMeta: ({G, playerID}, { gameRules, gameName }) => {
      if ((playerID === '0' || playerID === '1') && G.status === 'waiting') {
        G.gameRules = gameRules;
        G.gameName = gameName;
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

async function getRoom(roomCode) {
  const params = {
    TableName: "measuringcontest-rooms",
    Key: { roomCode }
  };
  
  const result = await dynamoDb.send(new GetCommand(params));
  return result.Item;
}

async function getRoomGames(roomCode) {
  const params = {
    TableName: "measuringcontest-games",
    KeyConditionExpression: "roomCode = :roomCode",
    ExpressionAttributeValues: {
      ":roomCode": roomCode
    }
  };
  
  const result = await dynamoDb.send(new QueryCommand(params));
  return result.Items || [];
}

async function deleteRoomAndGames(roomCode, games) {
  const transactItems = [];
  
  // Add room deletion to transaction
  transactItems.push({
    Delete: {
      TableName: "measuringcontest-rooms",
      Key: { roomCode }
    }
  });
  
  // Add all game deletions to transaction
  games.forEach(game => {
    transactItems.push({
      Delete: {
        TableName: "measuringcontest-games",
        Key: {
          roomCode: game.roomCode,
          gameId: game.gameId
        }
      }
    });
  });
  
  // Execute transaction (max 100 items per transaction)
  if (transactItems.length > 100) {
    throw new Error('Too many items to delete in a single transaction. Consider batch processing.');
  }
  
  const params = {
    TransactItems: transactItems
  };
  
  await dynamoDb.send(new TransactWriteCommand(params));
}

exports.handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.claims.sub;
    const roomCode = event.roomCode;
    
    // Get room details and verify ownership
    const room = await getRoom(roomCode);
    if (!room) {
      return {
        errorMessage: ROOM_NOT_FOUND_ERROR_MESSAGE,
        errorName: ROOM_NOT_FOUND_ERROR_NAME
      };
    }
    
    // Verify the user owns this room
    if (room.createdBy !== userId) {
      return {
        errorMessage: UNAUTHORIZED_ERROR_MESSAGE,
        errorName: UNAUTHORIZED_ERROR_NAME
      };
    }
    
    // Get JWT secret for socket connection
    const jwtSecret = await getJwtSecret();
    
    // Connect to RoomGame to update status before deletion
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
            extraHeaders: {
              'User-Agent': 'BoardGameEngine-Lambda/1.0'
            },
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

    // Call roomDeleted() move to notify connected clients
    roomClient.moves.roomDeleted();
    
    // Get all games for this room
    const games = await getRoomGames(roomCode);
    
    // Delete room and all games in a transaction
    await deleteRoomAndGames(roomCode, games);
    
    // Stop the socket connection
    roomClient.stop();
    
    return {
      success: true,
      message: `Room ${roomCode} and ${games.length} associated games deleted successfully.`
    };
    
  } catch (error) {
    console.error('Error deleting room:', error);
    return {
      errorMessage: error.message,
      errorName: error.name
    };
  }
};
