const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const { Client } = require('boardgame.io/client');
const { SocketIO } = require('boardgame.io/multiplayer');
const { ActivePlayers } = require('boardgame.io/core')
const jwt = require('jsonwebtoken');

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const ssmClient = new SSMClient({});

const BOARDGAME_SERVER_URL = 'https://gameserver.measuringcontest.com';

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
  },
};

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
  const roomGameId = room.roomGameId;
  
  // Check if player is a member
  const existingPlayer = room.members && room.members[sub];
  if (!existingPlayer) {
    return {
      message: "Player not in room"
    };
  }
  
  const boardgamePlayerID = existingPlayer.boardgamePlayerID;
  const jwtSecret = await getJwtSecret();
  
  // Connect to RoomGame as system to kick the player
  const systemToken = jwt.sign({
    gameId: roomGameId,
    playerId: 'System',
    purpose: 'gameserver-app'
  }, jwtSecret, { expiresIn: '5m' });

  let roomClient;
  
  try {
    // Connect as system player '0'
    roomClient = Client({
      game: RoomGame,
      multiplayer: SocketIO({ 
        server: BOARDGAME_SERVER_URL,
        socketOpts: {
          transports: ['websocket', 'polling']
        }
      }),
      matchID: roomGameId,
      playerID: '0',
      credentials: systemToken,
    });

    roomClient.start();

    // Wait for initial connection and state
    let initialState;
    await new Promise((resolve, reject) => {
      roomClient.subscribe((state) => {
        if (state !== null) {
          initialState = state;
          resolve();
        }
      });
      setTimeout(() => reject(new Error('Timeout connecting to RoomGame')), 10000);
    });

    console.error('Initial state players:', JSON.stringify(initialState.G.players));
    console.error('About to kick player:', boardgamePlayerID);
    
    // Now set up subscription to wait for the kick to take effect
    const kickPromise = new Promise((resolve) => {
      let updateCount = 0;
      const unsubscribe = roomClient.subscribe((state) => {
        if (state) {
          updateCount++;
          console.error(`State update #${updateCount}, players:`, JSON.stringify(state.G.players));
          
          if (!state.G.players[boardgamePlayerID]) {
            console.error('Player successfully removed from state!');
            unsubscribe();
            resolve(true);
          }
        }
      });
      
      // Timeout after 5 seconds
      setTimeout(() => {
        console.error('Timeout waiting for kick to take effect');
        unsubscribe();
        resolve(false);
      }, 5000);
    });

    // Execute the kick move
    console.error('Executing kick move...');
    roomClient.moves.kick(boardgamePlayerID);
    
    const kickSucceeded = await kickPromise;
    console.error('Kick result:', kickSucceeded);
    
  } catch (error) {
    console.error("Error kicking from RoomGame:", error);
  } finally {
    if (roomClient) {
      roomClient.stop();
    }
  }
  
  // Create JWT for server authentication
  const serverToken = jwt.sign({
    gameId: roomGameId,
    playerId: sub,
    purpose: 'gameserver-api'
  }, jwtSecret, { expiresIn: '5m' });
  
  // Call boardgame server leave endpoint to remove from match metadata
  try {
    const leaveResp = await fetch(`${BOARDGAME_SERVER_URL}/games/bgestagingroom/${roomGameId}/leave`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serverToken}`
      },
      body: JSON.stringify({ 
        playerID: boardgamePlayerID,
        credentials: serverToken
      }),
    });
    
    if (!leaveResp.ok) {
      const text = await leaveResp.text();
      throw new Error(`Boardgame server responded ${leaveResp.status} ${leaveResp.statusText}: ${text}`);
    }
  } catch (e) {
    console.error("Error calling leave endpoint:", e);
    // Continue to remove from DynamoDB anyway
  }
  
  // Remove player from DynamoDB
  await ddb.send(new UpdateCommand({
    TableName: "measuringcontest-rooms",
    Key: { roomCode },
    UpdateExpression: "REMOVE members.#userId",
    ExpressionAttributeNames: {
      "#userId": sub
    }
  }));
  
  return {
    message: "Successfully left room",
    roomCode,
    boardgamePlayerID
  };
};
