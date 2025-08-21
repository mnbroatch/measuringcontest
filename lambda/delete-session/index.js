const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, TransactWriteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const session = await deleteSession(
      event.sessionCode,
      event.requestContext.authorizer.claims.sub
    );
    return { val: session };
  } catch (error) {
    let errorMessage = error.message;
    let errorName = error.name;

    if (errorName === "TransactionCanceledException" && errorMessage.includes("ConditionalCheckFailed")) {
      errorMessage = "Session already deleted or does not exist";
    }

    return { errorMessage, errorName };
  }
};

async function deleteSession(sessionCode, creatorUserId) {
  const params = {
    TransactItems: [
      {
        Update: {
          TableName: "measuringcontest-users",
          Key: { userId: creatorUserId },
          UpdateExpression: "DELETE sessions :sessionCode",
          ExpressionAttributeValues: {
            ":sessionCode": new Set([sessionCode])
          }
        }
      },
      {
        Delete: {
          TableName: "measuringcontest-sessions",
          Key: { sessionCode }
        }
      }
    ]
  };

  await dynamoDb.send(new TransactWriteCommand(params));

  return { success: true, sessionCode };
}
