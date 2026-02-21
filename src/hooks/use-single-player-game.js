import { useGameserverConnection } from "./use-gameserver-connection.js";

export default function useSinglePlayerGame (gameRules, numPlayers) {
  return useGameserverConnection({
    gameRules,
    singlePlayer: true,
    numPlayers,
  })
}
