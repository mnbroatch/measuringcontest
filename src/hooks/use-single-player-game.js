import { useMemo } from 'react'
import { serialize, deserialize } from "wackson";
import { useGameserverConnection } from "./use-gameserver-connection.js";
import gameFactory from '../../server/game-factory/game-factory.js'
import { registry } from "../../server/game-factory/registry.js";

export default function useSinglePlayerGame (gameRules) {
  console.log('gameRules', gameRules)
  const game = useMemo(() => gameRules && gameFactory(JSON.parse(gameRules), 'WIP'), [gameRules])

  const client = useGameserverConnection({
    game,
    singlePlayer: true
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
    gameover = state?.ctx?.gameover
    moves = client && !gameover
      ? Object.entries(client.moves).reduce((acc, [moveName, m]) => {
        const move = function (payload) { m(preparePayload(payload)) }
        move.moveInstance = game.moves[moveName].moveInstance
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

function preparePayload (payload) {
  const payloadCopy = { ...payload }
  payloadCopy.entities =
    Object.entries(payloadCopy.entities).reduce((acc, [key, entity]) => ({
      ...acc,
      [key]: entity.entityId
    }), {})
  return JSON.parse(serialize(payloadCopy))
}
