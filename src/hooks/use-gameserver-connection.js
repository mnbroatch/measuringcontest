import { useEffect, useReducer, useRef } from 'react'
import { useParams } from '@tanstack/react-router';
import { Client } from 'boardgame.io/client'
import { SocketIO } from 'boardgame.io/multiplayer'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js"
import { useRoomQuery } from "../queries/use-room-query.js"
import gameFactory from '../game-factory.js'

const SERVER_URL = 'https://gameserver.measuringcontest.com'

export const useGameserverConnection = () => {
  const { roomcode: roomCode } = useParams({})
  const { userId, getAccessToken } = useCognitoAuth()
  const room = useRoomQuery(roomCode).data
  const gameId = room?.gameId
  const gameName = room?.gameName
  const gameRules = room?.gameRules
  const game = gameFactory(gameRules)
  const [_, forceUpdate] = useReducer(x => !x, false)
  const clientRef = useRef(null)
  
  useEffect(() => {
    if (!gameId || !userId || !room) return
    
    const joinAndConnect = async () => {
      try {
        // Call your join Lambda first
        const accessToken = await getAccessToken()
        const joinResp = await fetch(`/api/rooms/${roomCode}/join`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!joinResp.ok) {
          throw new Error(`Join failed: ${joinResp.statusText}`)
        }
        
        const { boardgamePlayerID, clientToken } = await joinResp.json()
        
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
        
        clientRef.current = client
        client.start()
        
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
