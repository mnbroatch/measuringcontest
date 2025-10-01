const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const jwt = require('jsonwebtoken');

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const ssmClient = new SSMClient({});
const BOARDGAME_SERVER_URL = 'https://gameserver.measuringcontest.com';

const GAME_STATUS = {
  WAITING: 'waiting',
  ACTIVE: 'active',
}

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
  if (room.createdBy !== sub) {
    throw new Error("Unauthorized"); // mapping template -> 403
  }

  // Get JWT secret from Parameter Store
  const jwtSecret = await getJwtSecret();

  // Create JWT for server authentication
  const token = jwt.sign({ purpose: 'gameserver-api' }, jwtSecret, { expiresIn: '1h' });

  const createResp = await fetch(`${BOARDGAME_SERVER_URL}/games/${body.gameName}/create`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ 
      allowedPlayers: Array.from(room.members),
      gameRules: body.gameRules
    }),
  });

  if (!createResp.ok) {
    const text = await createResp.text(); // read body even on error
    throw new Error(`Boardgame server responded ${createResp.status} ${createResp.statusText}: ${text}`);
  }

  const createData = await createResp.json();
  const gameId = createData.matchID;

  // Update room with game info
  await ddb.send(new UpdateCommand({
    TableName: "measuringcontest-rooms",
    Key: { roomCode },
    UpdateExpression: "SET gameId = :gameId, roomStatus = :status, players = :emptyPlayers, gameCreatedAt = :gameCreatedAt, gameName = :gameName, gameRules = :gameRules",
    ExpressionAttributeValues: {
      ":gameId": gameId,
      ":status": GAME_STATUS.ACTIVE,
      ":gameCreatedAt": Date.now(),
      ":gameName": body.gameName,
      ":gameRules": JSON.stringify(body.gameRules),
      ":emptyPlayers": {}, // Start with empty players object
      ":waitingStatus": GAME_STATUS.WAITING
    },
    ConditionExpression: "attribute_exists(roomCode) AND roomStatus = :waitingStatus"
  }));

  return {
    gameId,
  };
};
