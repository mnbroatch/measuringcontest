import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);

export async function incrementCounter() {
  const command = new UpdateCommand({
    TableName: "measuringcontest-global",
    Key: {
      property: "sessionid",
    },
    UpdateExpression: "ADD value :inc",
    ExpressionAttributeValues: {
      ":inc": 1,
    },
    ReturnValues: "UPDATED_NEW",
  });

  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ value: (await dynamoDb.send(command)).Attributes.value }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
}
