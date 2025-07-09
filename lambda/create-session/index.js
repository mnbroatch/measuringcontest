const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, UpdateCommand, TransactWriteCommand } = require("@aws-sdk/lib-dynamodb")

const client = new DynamoDBClient()
const dynamoDb = DynamoDBDocumentClient.from(client)
const MAX_SESSIONS_PER_USER = 1

exports.handler = async (event) => {
  try {
    const session = await createSession(await getSessionCode(), event.requestContext.authorizer.claims.sub)
    return { val: session }
  } catch (error) {
    return {
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name,
      event: event
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
            ":now": new Date().toISOString(),
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
            sessionStatus: "waiting",
            createdAt: new Date().toISOString(),
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

  return encodeAlphaCode(sessionCounter)
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
