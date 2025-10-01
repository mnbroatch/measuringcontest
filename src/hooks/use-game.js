import { serialize, deserialize } from "wackson";
import { useGameserverConnection } from "./use-gameserver-connection.js";
import { registry } from "../game-factory/registry.js";

export default function useGame () {
  const { client, game } = useGameserverConnection()
  const clientState = client?.getState()

  let state
  if (clientState) {
    state = {
      ...clientState,
      G: deserialize(JSON.stringify(clientState.G), registry),
    }
  }
  const gameover = state?.ctx?.gameover

  return {
    client,
    state,
    gameover,
    game,
    moves: client && !gameover
      ? Object.entries(client.moves).reduce((acc, [moveName, move]) => ({
        ...acc,
        [moveName]: (payload) => { move(preparePayload(payload)) }
      }), {})
      : []
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
