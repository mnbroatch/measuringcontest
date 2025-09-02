const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, TransactWriteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb")
const { randomUUID } = require('crypto')

const client = new DynamoDBClient()
const dynamoDb = DynamoDBDocumentClient.from(client)

const ROOM_NOT_FOUND_ERROR_MESSAGE = 'Room not found.'
const ROOM_NOT_FOUND_ERROR_NAME = 'ROOM_NOT_FOUND_ERROR'
const UNAUTHORIZED_ERROR_MESSAGE = 'You are not authorized to create games in this room.'
const UNAUTHORIZED_ERROR_NAME = 'UNAUTHORIZED_ERROR'

exports.handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.claims.sub
    const roomCode = event.pathParameters.roomCode
    
    // Get room details and verify it exists
    const room = await getRoom(roomCode)
    if (!room) {
      return {
        errorMessage: ROOM_NOT_FOUND_ERROR_MESSAGE,
        errorName: ROOM_NOT_FOUND_ERROR_NAME
      }
    }
    
    // Verify the user is a member of the room
    if (room.createdBy !== userId) // Only room creator
      return {
        errorMessage: UNAUTHORIZED_ERROR_MESSAGE,
        errorName: UNAUTHORIZED_ERROR_NAME
      }
    }
    
    // Generate a unique game ID
    const gameId = generateGameId()
    
    // Create game and update room in a transaction
    await createGameAndUpdateRoom(roomCode, gameId, userId)
    
    return {
      success: true,
      gameId: gameId,
      roomCode: roomCode
    }
    
  } catch (error) {
    console.error('Error creating game:', error)
    return {
      errorMessage: error.message,
      errorName: error.name
    }
  }
}

async function getRoom(roomCode) {
  const params = {
    TableName: "measuringcontest-rooms",
    Key: { roomCode }
  }
  
  const result = await dynamoDb.send(new GetCommand(params))
  return result.Item
}

function generateGameId() {
  // Using UUID for uniqueness, but you could use other approaches:
  // - randomUUID().slice(0, 8) for shorter IDs
  // - Custom alphanumeric generator
  // - Timestamp + random suffix
  return randomUUID()
}

async function createGameAndUpdateRoom(roomCode, gameId, userId) {
  const transactItems = [
    {
      // Create new game
      Put: {
        TableName: "measuringcontest-games",
        Item: {
          roomCode: roomCode,
          gameId: gameId,
          createdBy: userId,
          gameStatus: "waiting",
          players: new Set([userId]),
          scores: {},
          createdAt: Date.now(),
          // Add any other initial game properties you need
        },
        ConditionExpression: "attribute_not_exists(roomCode) AND attribute_not_exists(gameId)"
      }
    },
    {
      // Add gameId to room's games set
      Update: {
        TableName: "measuringcontest-rooms",
        Key: { roomCode: roomCode },
        UpdateExpression: "ADD games :gameId",
        ExpressionAttributeValues: {
          ":gameId": new Set([gameId])
        },
        // Ensure room still exists when we update it
        ConditionExpression: "attribute_exists(roomCode)"
      }
    }
  ]
  
  const params = {
    TransactItems: transactItems
  }
  
  await dynamoDb.send(new TransactWriteCommand(params))
}
