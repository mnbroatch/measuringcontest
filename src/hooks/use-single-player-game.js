import { useGameserverConnection } from "board-game-engine-react";

export default function useSinglePlayerGame (gameRules, numPlayers) {
  return useGameserverConnection({
    gameRules,
    singlePlayer: true,
    numPlayers,
  })
}
