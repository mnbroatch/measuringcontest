import { useMemo } from 'react'
import { serialize, deserialize } from "wackson";
import { useGameserverConnection } from "./use-gameserver-connection.js";
import gameFactory from '../../server/game-factory/game-factory.js'
import { registry } from "../../server/game-factory/registry.js";
import preparePayload from "../../server/game-factory/utils/prepare-payload.js";
import getCurrentMoves from "../../server/game-factory/utils/get-current-moves.js";

export default function useSinglePlayerGame (gameRules, numPlayers) {
  const game = useMemo(() => gameRules && gameFactory(JSON.parse(gameRules), 'WIP'), [gameRules])

  const client = useGameserverConnection({
    game,
    singlePlayer: true,
    numPlayers,
  })

  const clientState = client?.getState()

  let state
  let moves
  let gameover
  if (game && clientState) {
    state = {
      ...clientState,
      G: deserialize(JSON.stringify(clientState.G), registry),
      originalG: clientState.G,
    }

    moves = !gameover
      ? Object.entries(getCurrentMoves(game, state)).reduce((acc, [moveName, rawMove]) => {
          const move = function (payload) {
            client.moves[moveName](preparePayload(payload))
          }
          move.moveInstance = rawMove.moveInstance
          return {
            ...acc,
            [moveName]: move
          }
        }, {})
      : []
  }

  return {
    client,
    state,
    gameover,
    game,
    moves,
  }
}
