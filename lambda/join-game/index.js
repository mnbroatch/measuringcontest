const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
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
    throw new Error("Room not found"); // mapping template can map to 404
  }
  
  const room = roomResp.Item;

  const jwtSecret = await getJwtSecret();
  
  const existingPlayer = room.players?.[sub];
  if (existingPlayer) {
    // Return existing join data
    const clientToken = jwt.sign({ 
      gameId: room.gameId, 
      boardgamePlayerID: existingPlayer.boardgamePlayerID 
    }, jwtSecret, { expiresIn: '30d' });
    
    return {
      gameId: room.gameId,
      boardgamePlayerID: existingPlayer.boardgamePlayerID,
      clientToken: clientToken
    };
  }
  
  // Check if user is allowed to join this room
  if (!room.members || !room.members.has(sub)) {
    throw new Error("Not a member of this room"); // mapping template -> 403
  }
  
  // Check if game exists and is active
  if (!room.gameId || room.roomStatus !== 'active') {
    throw new Error("No active game in this room"); // mapping template -> 400
  }
  
  // Create JWT for server authentication (Lambda -> boardgame.io server)
  const serverToken = jwt.sign({}, jwtSecret, { expiresIn: '1h' });
  
  let joinData;
  try {
    console.log(`${BOARDGAME_SERVER_URL}/games/${room.gameName}/${room.gameId}/join`);
    const joinResp = await fetch(`${BOARDGAME_SERVER_URL}/games/${room.gameName}/${room.gameId}/join`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serverToken}`
      },
      body: JSON.stringify({ 
        playerName: sub,
        gameId: room.gameId
      }),
    });
    
    if (!joinResp.ok) {
      const text = await joinResp.text();
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

  await ddb.send(new UpdateCommand({
    TableName: "measuringcontest-rooms",
    Key: { roomCode },
    UpdateExpression: "SET players.#userId = :playerData",
    ExpressionAttributeNames: {
      "#userId": sub
    },
    ExpressionAttributeValues: {
      ":playerData": {
        boardgamePlayerID,
        joinedAt: Date.now()
      }
    }
  }));

  const clientToken = jwt.sign(
    {
      gameId: room.gameId,
      boardgamePlayerID: boardgamePlayerID
    },
    jwtSecret,
    { expiresIn: '365d' }
  );
  
  return {
    gameId: room.gameId,
    boardgamePlayerID: boardgamePlayerID,
    clientToken: clientToken
  };
};
