const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, TransactWriteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb")

const client = new DynamoDBClient()
const dynamoDb = DynamoDBDocumentClient.from(client)

const ROOM_NOT_FOUND_ERROR_MESSAGE = 'Room not found.'
const ROOM_NOT_FOUND_ERROR_NAME = 'ROOM_NOT_FOUND_ERROR'
const DELETE_UNAUTHORIZED_ERROR_MESSAGE = 'You are not authorized to delete this game.'
const DELETE_UNAUTHORIZED_ERROR_NAME = 'DELETE_UNAUTHORIZED_ERROR'

exports.handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.claims.sub
    const roomCode = event.pathParameters.sessionCode
    const gameId = event.pathParameters.gameId
    
    // Get room details and verify it exists
    const room = await getRoom(roomCode)
    if (!room) {
      return {
        errorMessage: ROOM_NOT_FOUND_ERROR_MESSAGE,
        errorName: ROOM_NOT_FOUND_ERROR_NAME
      }
    }
    
    // Delete game and update room in a transaction
    await deleteGameAndUpdateRoom(roomCode, gameId, userId)
    
    return {
      success: true,
      message: 'Game deleted successfully',
      gameId: gameId,
      roomCode: roomCode
    }
    
  } catch (error) {
    console.error('Error deleting game:', error)
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

async function deleteGameAndUpdateRoom(roomCode, gameId, userId) {
  const transactItems = [
    {
      // Delete the game
      Delete: {
        TableName: "measuringcontest-games",
        Key: {
          roomCode: roomCode,
          gameId: gameId
        },
        // Only allow deletion if the user created the game
        ConditionExpression: "createdBy = :userId",
        ExpressionAttributeValues: {
          ":userId": userId
        }
      }
    },
    {
      // Remove gameId from room's games set
      Update: {
        TableName: "measuringcontest-rooms",
        Key: { roomCode: roomCode },
        UpdateExpression: "DELETE games :gameId",
        ExpressionAttributeValues: {
          ":gameId": new Set([gameId])
        },
        ConditionExpression: "attribute_exists(roomCode) AND createdBy = :userId"
      }
    }
  ]
  
  const params = {
    TransactItems: transactItems
  }
  
  await dynamoDb.send(new TransactWriteCommand(params))
}
