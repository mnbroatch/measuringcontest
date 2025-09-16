const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, TransactWriteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

const BOARDGAME_SERVER_URL = 'https://gameserver.measuringcontest.com';

exports.handler = async (event) => {
  const { sessionCode: roomCode } = event.pathParameters;
  const { sub } = event.requestContext.authorizer.claims;
  const body = JSON.parse(event.body || "{}");

  // Fetch the room
  const roomResp = await ddb.send(
    new GetCommand({
      TableName: "measuringcontest-rooms",
      Key: { roomCode },
    })
  );

  if (!roomResp.Item) {
    throw new Error("Room not found"); // mapping template can map to 404
  }

  const room = roomResp.Item;

  if (room.createdBy !== sub) {
    throw new Error("Unauthorized"); // mapping template -> 403
  }

  // Generate game ID
  const gameId = `game-${Math.random().toString(36).slice(2, 10)}`;

  const createResp = await fetch(`${BOARDGAME_SERVER_URL}/games/${body.gameName}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numPlayers: body.numPlayers || 2 }),
  });
  const createData = await createResp.json();
  if (!createResp.ok) {
    throw new Error(`Boardgame server error: ${JSON.stringify(createData)}`);
  }

  // DynamoDB transaction
  const transactItems = [
    {
      Update: {
        TableName: "measuringcontest-rooms",
        Key: { roomCode },
        UpdateExpression: "ADD games :g",
        ExpressionAttributeValues: {
          ":g": new Set([gameId]), // string set
        },
      },
    },
    {
      Put: {
        TableName: "measuringcontest-games",
        Item: {
          roomCode,
          gameId,
          createdAt: Date.now(),
          createdBy: sub,
          gameName: body.gameName,
          gameRules: JSON.stringify(body.gameRules),
          gameState: null,
        },
        ConditionExpression: "attribute_not_exists(gameId)",
      },
    },
  ];

  await ddb.send(new TransactWriteCommand({ TransactItems: transactItems }));

  // Return object directly for mapping template
  return {
    gameId,
    boardgameIO: createData,
  };
};
