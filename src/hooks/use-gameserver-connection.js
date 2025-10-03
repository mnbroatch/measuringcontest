import { useEffect, useReducer, useRef } from 'react'
import { Client } from 'boardgame.io/client'
import { SocketIO } from 'boardgame.io/multiplayer'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js"

const SERVER_URL = 'https://gameserver.measuringcontest.com'

export const useGameserverConnection = ({ gameId, game, boardgamePlayerID, clientToken }) => {
  const { userId } = useCognitoAuth()
  const [_, forceUpdate] = useReducer(x => !x, false)
  const clientRef = useRef(null)

  useEffect(() => {
    if (!gameId || !userId) return
    
    const joinAndConnect = async () => {
      try {
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
        console.log('client.multiplayer', client.multiplayer)
        console.log('client.multiplayer.socket', client.multiplayer.socket)
        client.multiplayer.socket?.on('connect', forceUpdate)
        client.multiplayer.socket?.on('disconnect', forceUpdate)
        client.multiplayer.socket?.on('connect_error', forceUpdate)
        
        client.start()
        clientRef.current = client
        
      } catch (error) {
        console.error('Failed to join game:', error)
      }
    }
    
    joinAndConnect()
    
    return () => {
      clientRef.current?.stop()
      clientRef.current = null
    }
  }, [gameId, userId, boardgamePlayerID, clientToken, game])
  
  return clientRef.current
}
