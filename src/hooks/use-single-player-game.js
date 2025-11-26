import { useMemo } from 'react'
import { deserialize } from "wackson";
import { useGameserverConnection } from "./use-gameserver-connection.js";
import gameFactory from '../../server/game-factory/game-factory.js'
import { registry } from "../../server/game-factory/registry.js";
import preparePayload from "../utils/prepare-payload.js";
import getCurrentMoves from "../../server/game-factory/utils/get-current-moves.js";

export default function useSinglePlayerGame (gameRules, numPlayers) {
  const gameToUse = useMemo(() => gameRules && gameFactory(JSON.parse(gameRules), 'WIP'), [gameRules])

  const client = useGameserverConnection({
    game: gameToUse,
    singlePlayer: true,
    numPlayers,
  })

  const clientState = client?.getState()

  let state
  let moves
  let gameover
  if (clientState) {
    state = {
      ...clientState,
      G: deserialize(JSON.stringify(clientState.G), registry),
      originalG: clientState.G,
    }

    gameover = state?.ctx?.gameover

    moves = !gameover
      ? Object.entries(getCurrentMoves(state, client)).reduce((acc, [moveName, rawMove]) => {
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
    game: client?.game,
    moves,
  }
}
