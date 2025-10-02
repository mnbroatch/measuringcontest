const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, UpdateCommand, QueryCommand, PutCommand } = require("@aws-sdk/lib-dynamodb")
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const jwt = require('jsonwebtoken');

const client = new DynamoDBClient()
const dynamoDb = DynamoDBDocumentClient.from(client)
const ssmClient = new SSMClient({});

const MAX_SESSIONS_PER_USER = 1
const MAX_SESSIONS_ERROR_MESSAGE = 'You have reached the maximum number of rooms allowed.'
const MAX_SESSIONS_ERROR_NAME = 'MAX_SESSIONS_ERROR'
const MAX_USERS_IN_LOBBY = 32
const BOARDGAME_SERVER_URL = 'https://gameserver.measuringcontest.com';

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
  try {
    const userId = event.requestContext.authorizer.claims.sub
    
    const existingRooms = await getUserRoomCount(userId)
    if (existingRooms >= MAX_SESSIONS_PER_USER) {
      return {
        errorMessage: MAX_SESSIONS_ERROR_MESSAGE,
        errorName: MAX_SESSIONS_ERROR_NAME,
      }
    }

    const roomCode = await getRoomCode()
    const jwtSecret = await getJwtSecret();
    const serverToken = jwt.sign({ purpose: 'gameserver-api' }, jwtSecret, { expiresIn: '1h' });
    
    const createResp = await fetch(`${BOARDGAME_SERVER_URL}/games/bgestagingroom/create`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serverToken}`
      },
      body: JSON.stringify({ 
        numPlayers: MAX_USERS_IN_LOBBY
      }),
    });

    if (!createResp.ok) {
      const text = await createResp.text(); // read body even on error
      throw new Error(`Boardgame server responded ${createResp.status} ${createResp.statusText}: ${text}`);
    }

    const createData = await createResp.json();
    const roomGameId = createData.matchID;
    return await createRoom(roomCode, userId, roomGameId)
  } catch (error) {
    return {
      errorMessage: error.message,
      errorName: error.name,
    }
  }
}

async function getUserRoomCount(userId) {
  const params = {
    TableName: "measuringcontest-rooms",
    IndexName: "createdBy-index",
    KeyConditionExpression: "createdBy = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    },
    Select: "COUNT"
  }
  
  const result = await dynamoDb.send(new QueryCommand(params))
  return result.Count
}

async function createRoom(roomCode, userId, roomGameId) {
  const params = {
    TableName: "measuringcontest-rooms",
    Item: {
      roomCode,
      roomGameId,
      createdBy: userId,
      members: {
        [userId]: {
          joinedAt: Date.now()
        }
      },
      createdAt: Date.now(),
      expiresAtSeconds: Math.floor(Date.now() / 1000) + 24 * 3600,
    },
    ConditionExpression: "attribute_not_exists(roomCode)"
  };

  await dynamoDb.send(new PutCommand(params));
  return roomCode
}

async function getRoomCode() {
  const roomCounter = (await dynamoDb.send(
    new UpdateCommand({
      TableName: "measuringcontest-global",
      Key: {
        property: "roomcounter",
      },
      UpdateExpression: "ADD val :inc",
      ExpressionAttributeValues: {
        ":inc": 1,
      },
      ReturnValues: "UPDATED_NEW",
    })
  )).Attributes.val
  return encodeAlphaCode(scramble(roomCounter))
}

function encodeAlphaCode(num) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code = alphabet[num % 26] + code;
    num = Math.floor(num / 26);
  }
  return code;
}

function scramble(n) {
  const N = 26 ** 4 // total 4-letter codes
  const m = 314159  // coprime with N
  const b = 69420
  return (m * n + b) % N
}
