import { useEffect, useReducer, useState } from 'react'
import { flushSync } from 'react-dom'
import { BOARDGAME_SERVER_URL } from '../constants/api.js'
import { Client } from 'board-game-engine'

export const useGameserverConnection = ({
  gameId,
  gameRules,
  gameName,
  boardgameIOGame,
  boardgamePlayerID,
  clientToken,
  numPlayers,
  debug,
  singlePlayer = false,
  enabled = true,
}) => {
  const [_, forceUpdate] = useReducer(x => !x, false)
  const [connection, setConnection] = useState(null)

  useEffect(() => {
    if (!gameRules && !boardgameIOGame || !singlePlayer && (!gameId || !clientToken || !enabled)) return

    const onClientUpdate = () => {
      // wrapping forceUpdate means we don't batch updates
      // and skip certain transitional states
      setTimeout(() => {
        flushSync(() => {
          forceUpdate()
        })
      }, 0)
    }

    const options = {
      server: BOARDGAME_SERVER_URL,
      numPlayers,
      onClientUpdate,
      debug,
      gameId,
      gameRules,
      boardgameIOGame,
      gameName,
      boardgamePlayerID,
      clientToken,
      singlePlayer,
    }

    const newConnection = new Client(options)

    newConnection.connect()

    setConnection(newConnection)

    return () => {
      connection?.client?.stop()
      setConnection(null)
    }
  }, [gameId, boardgamePlayerID, clientToken, gameRules, boardgameIOGame, enabled])

  if (connection) {
    return Object.assign(
      connection,
      connection?.getState?.(),
    )
  } else {
    return {}
  }
}
