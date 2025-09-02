const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient, QueryCommand, TransactWriteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb")

const client = new DynamoDBClient()
const dynamoDb = DynamoDBDocumentClient.from(client)

const ROOM_NOT_FOUND_ERROR_MESSAGE = 'Room not found.'
const ROOM_NOT_FOUND_ERROR_NAME = 'ROOM_NOT_FOUND_ERROR'
const UNAUTHORIZED_ERROR_MESSAGE = 'You are not authorized to delete this room.'
const UNAUTHORIZED_ERROR_NAME = 'UNAUTHORIZED_ERROR'

exports.handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.claims.sub
    const roomCode = event.roomCode
    
    // Get room details and verify ownership
    const room = await getRoom(roomCode)
    if (!room) {
      return {
        errorMessage: ROOM_NOT_FOUND_ERROR_MESSAGE,
        errorName: ROOM_NOT_FOUND_ERROR_NAME
      }
    }
    
    // Verify the user owns this room
    if (room.createdBy !== userId) {
      return {
        errorMessage: UNAUTHORIZED_ERROR_MESSAGE,
        errorName: UNAUTHORIZED_ERROR_NAME
      }
    }
    
    // Get all games for this room
    const games = await getRoomGames(roomCode)
    
    // Delete room and all games in a transaction
    await deleteRoomAndGames(roomCode, games)
    
    return {
      success: true,
      message: `Room ${roomCode} and ${games.length} associated games deleted successfully.`
    }
    
  } catch (error) {
    console.error('Error deleting room:', error)
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

async function getRoomGames(roomCode) {
  const params = {
    TableName: "measuringcontest-games",
    KeyConditionExpression: "roomCode = :roomCode",
    ExpressionAttributeValues: {
      ":roomCode": roomCode
    }
  }
  
  const result = await dynamoDb.send(new QueryCommand(params))
  return result.Items || []
}

async function deleteRoomAndGames(roomCode, games) {
  const transactItems = []
  
  // Add room deletion to transaction
  transactItems.push({
    Delete: {
      TableName: "measuringcontest-rooms",
      Key: { roomCode }
    }
  })
  
  // Add all game deletions to transaction
  games.forEach(game => {
    transactItems.push({
      Delete: {
        TableName: "measuringcontest-games",
        Key: {
          roomCode: game.roomCode,
          gameId: game.gameId
        }
      }
    })
  })
  
  // Execute transaction (max 100 items per transaction)
  if (transactItems.length > 100) {
    throw new Error('Too many items to delete in a single transaction. Consider batch processing.')
  }
  
  const params = {
    TransactItems: transactItems
  }
  
  await dynamoDb.send(new TransactWriteCommand(params))
}
