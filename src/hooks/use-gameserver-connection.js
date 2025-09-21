import { useEffect, useReducer, useRef } from 'react'
import { useParams } from '@tanstack/react-router';
import { Client } from 'boardgame.io/client'
import { SocketIO } from 'boardgame.io/multiplayer'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js"
import { useRoomQuery } from "../queries/use-room-query.js"
import { useJoinGameMutation } from "../queries/use-join-game-mutation.js";
import gameFactory from '../game-factory.js'

const SERVER_URL = 'https://gameserver.measuringcontest.com'

export const useGameserverConnection = () => {
  const { roomcode: roomCode } = useParams({})
  const { userId } = useCognitoAuth()
  const room = useRoomQuery(roomCode).data
  const gameId = room?.gameId
  const gameRules = room?.gameRules
  const game = gameFactory(gameRules)
  const [_, forceUpdate] = useReducer(x => !x, false)
  const clientRef = useRef(null)
  const joinGameMutation = useJoinGameMutation(roomCode, gameId)
  
  useEffect(() => {
    if (!gameId || !userId || !room) return
    
    const joinAndConnect = async () => {
      try {
        const { boardgamePlayerID, clientToken } = await joinGameMutation.mutateAsync()
        
        // Now create the client with the proper credentials
        const client = Client({
          game,
          multiplayer: SocketIO({ 
            server: SERVER_URL,
            socketOpts: {
              transports: ['websocket', 'polling']
            }
          }),
          matchID: gameId,
          playerID: boardgamePlayerID,
          credentials: clientToken, // JWT for boardgame.io auth
          debug: process.env.NODE_ENV === 'development'
        })
        
        client.subscribe(() => {
          forceUpdate()
        })
        
        client.multiplayer.socket?.on('connect', forceUpdate)
        client.multiplayer.socket?.on('disconnect', forceUpdate)
        client.multiplayer.socket?.on('connect_error', forceUpdate)
        
        client.start()
        clientRef.current = client
        console.log('client', client)
        
      } catch (error) {
        console.error('Failed to join game:', error)
      }
    }
    
    joinAndConnect()
    
    return () => {
      clientRef.current?.stop()
      clientRef.current = null
    }
  }, [gameId, userId, roomCode])
  
  return clientRef.current
}
