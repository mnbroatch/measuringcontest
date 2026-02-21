import { useEffect, useReducer, useState } from 'react'
import { flushSync } from 'react-dom'
import { BOARDGAME_SERVER_URL } from '../constants/api.js'
import { Client } from 'board-game-engine'

export const useGameserverConnection = ({
  gameId,
  gameRules,
  gameName,
  game,
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

    const options = {
      server: BOARDGAME_SERVER_URL,
      numPlayers,
      onClientUpdate,
      debug,
      gameId,
      gameRules,
      game,
      gameName,
      boardgamePlayerID,
      clientToken,
      singlePlayer,
    }

    console.log('options', options)

    const newConnection = new Client(options)

    newConnection.connect()

    setConnection(newConnection)

    return () => {
      connection?.client?.stop()
      setConnection(null)
    }
  }, [gameId, boardgamePlayerID, clientToken, gameRules, enabled])

  if (connection) {
    return Object.assign(
      connection,
      connection?.getState?.(),
    )
  } else {
    return {}
  }
}
