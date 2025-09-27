import { serialize, deserialize } from "wackson";
import { useGameserverConnection } from "./use-gameserver-connection.js";
import { registry } from "../game-factory/registry.js";

export default function useGame () {
  const client = useGameserverConnection()
  const state = client?.getState()
  return {
    client,
    G: state && deserialize(JSON.stringify(state.G), registry),
    moves: client && Object.entries(client.moves).reduce((acc, [moveName, move]) => ({
      ...acc,
      [moveName]: (payload) => { move(JSON.parse(serialize(payload))) }
    }), {})
  }
}
