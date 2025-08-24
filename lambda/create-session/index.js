const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, UpdateCommand, QueryCommand, PutCommand } = require("@aws-sdk/lib-dynamodb")
const client = new DynamoDBClient()
const dynamoDb = DynamoDBDocumentClient.from(client)
const MAX_SESSIONS_PER_USER = 1
const MAX_SESSIONS_ERROR_MESSAGE = 'You have reached the maximum number of sessions allowed.'
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
    
    const existingSessions = await getUserSessionCount(userId)
    if (existingSessions >= MAX_SESSIONS_PER_USER) {
      return {
        errorMessage: MAX_SESSIONS_ERROR_MESSAGE,
        errorName: MAX_SESSIONS_ERROR_NAME,
      }
    }
    
    const session = await createSession(await getSessionCode(), userId, gameRules)
    return { val: session }
  } catch (error) {
    return {
      errorMessage: error.message,
      errorName: error.name,
    }
  }
}

async function getUserSessionCount(userId) {
  const params = {
    TableName: "measuringcontest-sessions",
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

async function createSession(sessionCode, userId, gameRules) {
  const params = {
    TableName: "measuringcontest-sessions",
    Item: {
      sessionCode,
      createdBy: userId,
      members: new Set([userId]),
      sessionStatus: "waiting",
      createdAt: Date.now(),
      expiresAtSeconds: Math.floor(Date.now() / 1000) + 24 * 3600,
      gameRules,
    },
    ConditionExpression: "attribute_not_exists(sessionCode)"
  }
  
  await dynamoDb.send(new PutCommand(params))
  return { success: true, sessionCode, gameRules }
}

async function getSessionCode() {
  const sessionCounter = (await dynamoDb.send(
    new UpdateCommand({
      TableName: "measuringcontest-global",
      Key: {
        property: "sessioncounter",
      },
      UpdateExpression: "ADD val :inc",
      ExpressionAttributeValues: {
        ":inc": 1,
      },
      ReturnValues: "UPDATED_NEW",
    })
  )).Attributes.val
  return encodeAlphaCode(scramble(sessionCounter))
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
