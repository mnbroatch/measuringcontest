import { useMemo } from 'react'
import { serialize, deserialize } from "wackson";
import { useGameserverConnection } from "./use-gameserver-connection.js";
import gameFactory from '../../server/game-factory/game-factory.js'
import { registry } from "../../server/game-factory/registry.js";
import preparePayload from "../../server/game-factory/utils/prepare-payload.js";

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
    const rawMoves = game.turn?.stages?.[state.ctx.activePlayers?.[client.playerID]]?.moves ?? game.moves
    // todo: loop over rawMoves instead
    moves = client.playerID && !gameover
      ? Object.entries(client.moves).reduce((acc, [moveName, m]) => {
          const move = function (payload) { m(preparePayload(payload)) }
          if (!rawMoves[moveName]) return acc
          move.moveInstance = rawMoves[moveName].moveInstance
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
