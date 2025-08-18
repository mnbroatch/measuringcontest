const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, UpdateCommand, TransactWriteCommand } = require("@aws-sdk/lib-dynamodb")

const client = new DynamoDBClient()
const dynamoDb = DynamoDBDocumentClient.from(client)
const MAX_SESSIONS_PER_USER = 1
const MAX_SESSIONS_ERROR_MESSAGE = 'You have reached the maximum number of sessions allowed.'
const MAX_SESSIONS_ERROR_NAME = 'MAX_SESSIONS_ERROR'

exports.handler = async (event) => {
  try {
    const session = await createSession(await getSessionCode(), event.requestContext.authorizer.claims.sub)
    return { val: session }
  } catch (error) {
    let errorMessage = error.message
    let errorName = error.name
    if (error.name === "TransactionCanceledException" && error.message.includes("ConditionalCheckFailed")) {
      errorMessage = MAX_SESSIONS_ERROR_MESSAGE
      errorName = MAX_SESSIONS_ERROR_NAME
    }
    return {
      errorMessage,
      errorName,
    }
  }
}

async function createSession (sessionCode, userId) {
  const params = {
    TransactItems: [
      {
        Update: {
          TableName: "measuringcontest-users",
          Key: { userId },
          UpdateExpression: 'SET sessions = list_append(if_not_exists(sessions, :emptyList), :newSession), createdAt = if_not_exists(createdAt, :now)',
          ConditionExpression: "attribute_not_exists(sessions) OR size(sessions) < :maxSessions",
          ExpressionAttributeValues: {
            ":newSession": [sessionCode],
            ":emptyList": [],
            ":now": Date.now(),
            ":maxSessions": MAX_SESSIONS_PER_USER,
          }
        }
      },
      {
        Put: {
          TableName: "measuringcontest-sessions",
          Item: {
            sessionCode,
            createdBy: userId,
            members: [userId],
            sessionStatus: "waiting",
            createdAt: Date.now(),
            expiresAtSeconds: Math.floor(Date.now() / 1000) + 24 * 3600
          },
          ConditionExpression: "attribute_not_exists(sessionCode)"
        }
      }
    ]
  };

  await dynamoDb.send(new TransactWriteCommand(params));
  return { success: true, sessionCode };
}

async function getSessionCode () {
  const  sessionCounter = (await dynamoDb.send(
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

// make session code less predictable so people don't easily guess others'
// someone could definitely reverse engineer this but probably won't
function scramble(n) {
  const N = 26 ** 4 // total 4-letter codes
  const m = 314159  // coprime with N
  const b = 69420
  return (m * n + b) % N
}
