import { useEffect, useReducer, useRef } from 'react'
import { Client } from 'boardgame.io/react'
import { SocketIO } from 'boardgame.io/multiplayer'
import { useCognitoAuth } from "../contexts/cognito-auth-context.js"
import { useRoomQuery } from "../queries/use-room-query.js"

const SERVER_URL = 'https://gameserver.measuringcontest.com'

const YourGameBoard = ({ G, ctx, moves, playerID }) => {
  return (
    <div>
      <h3>Game Board</h3>
      <pre>{JSON.stringify({ G, ctx, playerID }, null, 2)}</pre>
    </div>
  )
}

export const useGameserverConnection = () => {
  const { userId } = useCognitoAuth()
  const gameId = useRoomQuery().data?.gameId
  const gameName = useRoomQuery().data?.gameName
  const [_, forceUpdate] = useReducer(x => !x, false)
  const clientRef = useRef(null)

  useEffect(() => {
    if (!gameId || !userId) return

    const client = Client({
      game: { name: gameName },
      board: YourGameBoard,
      multiplayer: SocketIO({ 
        server: SERVER_URL,
        socketOpts: {
          transports: ['websocket', 'polling']
        }
      }),
      gameID: gameId,
      playerID: userId,
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

    return () => {
      clientRef.current?.stop()
      clientRef.current = null
    }
  }, [gameId, userId, gameName])

  return clientRef.current
}
