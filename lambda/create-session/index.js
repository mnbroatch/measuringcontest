const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb")

const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const session = await createSession(await getSessionCode(), body.createdBy)
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






