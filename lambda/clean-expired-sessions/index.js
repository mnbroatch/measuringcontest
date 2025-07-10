// TODO


const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, GetCommand, TransactWriteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const dynamoDb = DynamoDBDocumentClient.from(client);

async function cleanupExpiredSessions() {
  const now = Math.floor(Date.now() / 1000);
  let ExclusiveStartKey = undefined;

  do {
    const scanResult = await dynamoDb.send(new ScanCommand({
      TableName: "sessions",
      FilterExpression: "expiresAtSeconds < :now",
      ExpressionAttributeValues: { ":now": now },
      ExclusiveStartKey,
      ProjectionExpression: "sessionCode, createdBy"
    }));

    for (const session of scanResult.Items) {
      try {
        await deleteSessionAndRemoveFromUser(session.createdBy, session.sessionCode);
        console.log(`Cleaned up expired session ${session.sessionCode} for user ${session.createdBy}`);
      } catch (error) {
        console.error(`Failed to clean session ${session.sessionCode}:`, error);
      }
    }

    ExclusiveStartKey = scanResult.LastEvaluatedKey;
  } while (ExclusiveStartKey);
}

async function deleteSessionAndRemoveFromUser(userId, sessionCode) {
  // Get user's current sessions list to find index of sessionCode
  const user = await dynamoDb.send(new GetCommand({
    TableName: "users",
    Key: { userId },
    ProjectionExpression: "sessions"
  }));

  if (!user.Item || !user.Item.sessions) {
    console.warn(`User ${userId} has no sessions list; skipping removal`);
    // Just delete the session anyway, to avoid lingering session
    await deleteSession(sessionCode);
    return;
  }

  const index = user.Item.sessions.indexOf(sessionCode);
  if (index === -1) {
    console.warn(`Session code ${sessionCode} not found in user ${userId}'s sessions; skipping removal`);
    await deleteSession(sessionCode);
    return;
  }

  // Transactionally delete session and remove from user sessions list
  const transactParams = {
    TransactItems: [
      {
        Delete: {
          TableName: "sessions",
          Key: { sessionCode }
        }
      },
      {
        Update: {
          TableName: "users",
          Key: { userId },
          UpdateExpression: `REMOVE sessions[${index}]`,
          ConditionExpression: "contains(sessions, :sessionCode)",
          ExpressionAttributeValues: {
            ":sessionCode": sessionCode
          }
        }
      }
    ]
  };

  await dynamoDb.send(new TransactWriteCommand(transactParams));
}

async function deleteSession(sessionCode) {
  await dynamoDb.send(new DeleteCommand({
    TableName: "sessions",
    Key: { sessionCode }
  }));
}

// To execute cleanup:
// cleanupExpiredSessions().catch(console.error);
