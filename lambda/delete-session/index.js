const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, TransactWriteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);

async function deleteSession(sessionCode, creatorUserId) {
  const { Item } = await dynamoDb.send(
    new GetCommand({
      TableName: "measuringcontest-users",
      Key: { userId: creatorUserId },
      ProjectionExpression: "sessions"
    })
  );

  if (!Item?.sessions || !Array.isArray(Item.sessions)) {
    throw new Error("No sessions found for this user");
  }

  const index = Item.sessions.indexOf(sessionCode);
  if (index === -1) throw new Error("Session not found in creator's list");

  const params = {
    TransactItems: [
      {
        Update: {
          TableName: "measuringcontest-users",
          Key: { userId: creatorUserId },
          UpdateExpression: `REMOVE sessions[${index}]`,
          ConditionExpression: "contains(sessions, :code)",
          ExpressionAttributeValues: {
            ":code": sessionCode
          }
        }
      },
      {
        Delete: {
          TableName: "measuringcontest-sessions",
          Key: { sessionCode },
          ConditionExpression: "attribute_exists(sessionCode)"
        }
      }
    ]
  };

  await dynamoDb.send(new TransactWriteCommand(params));

  return { success: true, sessionCode };
}

module.exports = { deleteSession };
