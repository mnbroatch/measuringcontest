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
  
  // Create JWT for server authentication
  const serverToken = jwt.sign({
    gameId: roomGameId,
    playerId: sub,
    purpose: 'gameserver-api'
  }, jwtSecret, { expiresIn: '5m' })
  
  // Call boardgame server leave endpoint
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
    console.error("Fetch error details:", e);
    return {
      error: e.message,
      stack: e.stack,
      cause: e.cause
    };
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
