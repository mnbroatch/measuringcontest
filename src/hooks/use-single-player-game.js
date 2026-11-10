import { useMemo } from 'react'
import { useGameserverConnection } from "board-game-engine-react";
import { normalizeGameRules } from '../utils/game-rules-object.js'

export default function useSinglePlayerGame (gameRules, numPlayers) {
  const rulesObject = useMemo(
    () => normalizeGameRules(gameRules),
    [gameRules]
  )
  return useGameserverConnection({
    gameRules: rulesObject,
    numPlayers,
  })
}
