const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, UpdateCommand, QueryCommand, PutCommand } = require("@aws-sdk/lib-dynamodb")
const client = new DynamoDBClient()
const dynamoDb = DynamoDBDocumentClient.from(client)
const MAX_SESSIONS_PER_USER = 1
const MAX_SESSIONS_ERROR_MESSAGE = 'You have reached the maximum number of rooms allowed.'
const MAX_SESSIONS_ERROR_NAME = 'MAX_SESSIONS_ERROR'

exports.handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.claims.sub
    
    let gameRules
    try {
      const body = JSON.parse(event.body)
      gameRules = body.gameRules
      if (!gameRules) {
        return {
          errorMessage: 'gameRules object is required in request body',
          errorName: 'MISSING_OPTIONS_ERROR',
        }
      }
    } catch (parseError) {
      return {
        errorMessage: 'Failed to parse request body: ' + parseError.message,
        errorName: 'INVALID_REQUEST_BODY_ERROR',
      }
    }
    
    const existingRooms = await getUserRoomCount(userId)
    if (existingRooms >= MAX_SESSIONS_PER_USER) {
      return {
        errorMessage: MAX_SESSIONS_ERROR_MESSAGE,
        errorName: MAX_SESSIONS_ERROR_NAME,
      }
    }
    
    const room = await createRoom(await getRoomCode(), userId, gameRules)
    return { val: room }
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

// we stringify gameRules for several reasons:
//   - api gateway's vtl engine doesn't support mapping arbitrary nested objects
//   - dynamo can't map objects > 32 layers deep and we want arbitrary depth
//   - json string gets sent naturally in response and thus just works on GET
async function createRoom(roomCode, userId, gameRules) {
  const params = {
    TableName: "measuringcontest-rooms",
    Item: {
      roomCode,
      createdBy: userId,
      members: new Set([userId]),
      roomStatus: "waiting",
      createdAt: Date.now(),
      expiresAtSeconds: Math.floor(Date.now() / 1000) + 24 * 3600,
      gameRules: JSON.stringify(gameRules),
    },
    ConditionExpression: "attribute_not_exists(roomCode)"
  }
  
  await dynamoDb.send(new PutCommand(params))
  return { success: true, roomCode, gameRules }
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
