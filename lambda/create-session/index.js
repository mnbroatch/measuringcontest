const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb")

const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);

exports.handler = async () => {
  const session = await createSession(await getSessionCode())
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ value: session }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
}

async function getSessionCode () {
  const  sessionCounter = (await dynamoDb.send(
    new UpdateCommand({
      TableName: "measuringcontest-global",
      Key: {
        property: "sessioncounter",
      },
      UpdateExpression: "ADD value :inc",
      ExpressionAttributeValues: {
        ":inc": 1,
      },
      ReturnValues: "UPDATED_NEW",
    })
  )).Attributes.value

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

async function createSession (sessionCode) {
  return dynamoDb.send(
    new UpdateCommand({
      TableName: "measuringcontest-sessions",
      Key: { sessioncode: sessionCode },
      UpdateExpression: "SET #status = :status, #createdAt = :createdAt",
      ExpressionAttributeNames: {
        "#status": "status",
        "#createdAt": "createdAt",
      },
      ExpressionAttributeValues: {
        ":status": "waiting",
        ":createdAt": new Date().toISOString(),
      },
      ConditionExpression: "attribute_not_exists(sessionCode)", // avoid overwrite if by some chance code re-used
    })
  )
}
