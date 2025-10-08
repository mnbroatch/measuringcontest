import { useEffect, useReducer, useRef } from 'react'
import { flushSync } from 'react-dom'
import { Client } from 'boardgame.io/client'
import { SocketIO } from 'boardgame.io/multiplayer'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js"

const SERVER_URL = 'https://gameserver.measuringcontest.com'

export const useGameserverConnection = ({
  gameId,
  game,
  boardgamePlayerID,
  clientToken,
  numPlayers,
  debug = true,
  singlePlayer = false,
  enabled = true,
}) => {
  const { userId } = useCognitoAuth()
  const [_, forceUpdate] = useReducer(x => !x, false)
  const clientRef = useRef(null)

  useEffect(() => {
    if (!game || !singlePlayer && (!gameId || !userId || !enabled)) return

    const connect = async () => {
      try {
        const clientOptions = singlePlayer
          ? { game, numPlayers }
          : {
              game,
              multiplayer: singlePlayer ? undefined : SocketIO({
                server: SERVER_URL,
                socketOpts: {
                  transports: ['websocket', 'polling']
                }
              }),
              matchID: gameId,
              playerID: boardgamePlayerID,
              credentials: clientToken,
              debug,
            }
        const client = Client(clientOptions)

        client.subscribe(() => {
          // wrapping forceUpdate means we don't batch updates
          // and skip certain transitional states
          setTimeout(() => {
            flushSync(() => {
              forceUpdate()
            })
          }, 0)
        })

        client.start()
        clientRef.current = client
        
      } catch (error) {
        console.error('Failed to join game:', error)
      }
    }

    connect()

    return () => {
      clientRef.current?.stop()
      clientRef.current = null
    }
  }, [gameId, userId, boardgamePlayerID, clientToken, game, enabled])

  return clientRef.current
}
