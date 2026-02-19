import { useEffect, useReducer, useRef } from 'react'
import { flushSync } from 'react-dom'
import { BOARDGAME_SERVER_URL } from '../constants/api.js'
import { Client } from 'board-game-engine'

export const useGameserverConnection = ({
  gameId,
  gameRules,
  rulesHash,
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
    if (!gameRules || !singlePlayer && (!gameId || !clientToken || !enabled)) return

    const onClientUpdate = () => {
      // wrapping forceUpdate means we don't batch updates
      // and skip certain transitional states
      setTimeout(() => {
        flushSync(() => {
          forceUpdate()
        })
      }, 0)
    }

    connectionRef.current = new Client ({
      server: BOARDGAME_SERVER_URL,
      numPlayers,
      onClientUpdate,
      debug,
      gameId,
      gameRules,
      rulesHash,
      boardgamePlayerID,
      clientToken,
      singlePlayer,
    })

    return () => {
      connectionRef.current?.client?.stop()
      connectionRef.current = null
    }
  }, [gameId, boardgamePlayerID, clientToken, gameRules, enabled])

  return {
    ...connectionRef.current,
    ...connectionRef.current?.getState?.(),
  }
}
