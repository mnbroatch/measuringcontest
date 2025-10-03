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
  const { sessionCode: roomCode, gameId } = event.pathParameters;
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
  const jwtSecret = await getJwtSecret();
  
  const clientToken = jwt.sign({
    gameId: room.gameId,
    roomGameId: room.roomGameId,
    playerId: sub,
    purpose: 'gameserver-app'
  }, jwtSecret, { expiresIn: '30d' });

  const player = room.players?.[sub];
  if (!player) {
    throw new Error("Not a registered player");
  }
  
  if (player.joinedAt) {
    return {
      gameId: room.gameId,
      boardgamePlayerID: player.boardgamePlayerID,
      clientToken
    };
  }
  
  if (!room.gameId) {
    throw new Error("No game in this room");
  }
  
  // Create single JWT that includes both server auth and player data
  const serverToken = jwt.sign({
    gameId: room.gameId,
    roomGameId: room.roomGameId,
    playerId: sub,
    purpose: 'gameserver-api'
  }, jwtSecret, { expiresIn: '30d' });
  
  let joinData;
  try {
    const joinResp = await fetch(`${BOARDGAME_SERVER_URL}/games/${room.rulesHash}/${room.gameId}/join`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serverToken}`
      },
      body: JSON.stringify({ 
        playerName: player.name,
        data: {
          gameId: room.gameId,
          playerId: sub
        }
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
  
  // Store player data in DynamoDB
  await ddb.send(new UpdateCommand({
    TableName: "measuringcontest-rooms",
    Key: { roomCode },
    UpdateExpression: "SET players.#userId = :playerData",
    ExpressionAttributeNames: {
      "#userId": sub
    },
    ExpressionAttributeValues: {
      ":playerData": {
        ...player,
        boardgamePlayerID,
        joinedAt: Date.now()
      }
    }
  }));
  
  return {
    gameId: room.gameId,
    boardgamePlayerID: boardgamePlayerID,
    clientToken
  };
};
