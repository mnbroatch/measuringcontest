import { useMemo } from 'react'
import { useGameserverConnection } from "./use-gameserver-connection.js";
import gameFactory from '../../server/game-factory/game-factory.js'

export default function useSinglePlayerGame (gameRules, numPlayers) {
  const gameToUse = useMemo(() => gameRules && gameFactory(JSON.parse(gameRules), 'WIP'), [gameRules])

  return useGameserverConnection({
    game: gameToUse,
    singlePlayer: true,
    numPlayers,
  })
}
