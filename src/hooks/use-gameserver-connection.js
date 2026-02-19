import { useEffect, useReducer, useRef } from 'react'
import { flushSync } from 'react-dom'
import connectToGameserver from "../utils/connect-to-gameserver";
import { BOARDGAME_SERVER_URL } from '../constants/api.js'

export const useGameserverConnection = ({
  gameId,
  game,
  boardgamePlayerID,
  clientToken,
  numPlayers,
  debug,
  singlePlayer = false,
  enabled = true,
}) => {
  const [_, forceUpdate] = useReducer(x => !x, false)
  const connectionRef = useRef(null)

  useEffect(() => {
    if (!game || !singlePlayer && (!gameId || !clientToken || !enabled)) return

    const onClientUpdate = () => {
      // wrapping forceUpdate means we don't batch updates
      // and skip certain transitional states
      setTimeout(() => {
        flushSync(() => {
          forceUpdate()
        })
      }, 0)
    }

    connectionRef.current = connectToGameserver({
      server: BOARDGAME_SERVER_URL,
      numPlayers,
      onClientUpdate,
      debug,
      gameId,
      game,
      boardgamePlayerID,
      clientToken,
      singlePlayer,
    })

    return () => {
      connectionRef.current?.client?.stop()
      connectionRef.current = null
    }
  }, [gameId, boardgamePlayerID, clientToken, game, enabled])

  return {
    client: connectionRef.current?.client,
    ...connectionRef.current?.getState?.(),
    game
  }
}
