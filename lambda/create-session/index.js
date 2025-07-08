const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, QueryCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb")

const client = new DynamoDBClient()
const dynamoDb = DynamoDBDocumentClient.from(client)
const MAX_SESSIONS_PER_USER = 1

exports.handler = async (event) => {
  try {
    await assertUserSessionLimit
    const session = await createSession(await getSessionCode(), event.createdBy)
    return { val: session }
  } catch (error) {
    return {
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name,
    }
  }
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

async function createSession (sessionCode, createdBy) {
  return dynamoDb.send(
    new UpdateCommand({
      TableName: "measuringcontest-sessions",
      Key: { sessioncode: sessionCode },
      UpdateExpression: "SET sessionStatus = :sessionStatus, createdAt = :createdAt, expiresAtSeconds = :expiresAtSeconds, createdBy = :createdBy",
      ExpressionAttributeValues: {
        ":sessionStatus": "waiting",
        ":createdAt": new Date().toISOString(),
        ":createdBy": createdBy,
        ":expiresAtSeconds": Math.floor(Date.now()/ 1000) + 24 * 60 * 60,
      },
      ConditionExpression: "attribute_not_exists(sessioncode)",
    })
  )
}


async function assertUserSessionLimit (userId) {
  const { Count } = await dynamoDb.send(new QueryCommand({
    TableName: "measuringcontest-sessions",
    IndexName: "createdBy-index",
    KeyConditionExpression: "createdBy = :createdBy",
    ExpressionAttributeValues: {
      ":createdBy": userId,
    },
    Select: "COUNT",
  }));

  if (Count >= MAX_SESSIONS_PER_USER) {
    throw new Error("You have reached the maximum number of sessions allowed.");
  }
}
