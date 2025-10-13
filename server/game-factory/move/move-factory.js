import { serialize, deserialize } from 'wackson'
import { registry } from '../registry.js'
import MoveEntity from "./move-entity.js";
// import Swap from "./swap.js";

export default function moveFactory(moveRule) {
  let moveInstance
  if (moveRule.type === "MoveEntity") {
    moveInstance = new MoveEntity(moveRule);
  // } else if (moveRule.type === "swap") {
  //   moveInstance = new Swap(moveRule);
  }

  // accepts serialized G and payload, returns serialized
  const compatibleMove = function (
    {
      G: serializableG,
      ...restBgioArguments
    },
    serializablePayload
  ) {
    const G = deserialize(JSON.stringify(serializableG), registry)
    const payload = revivePayload(serializablePayload, G)
    const context = { moveInstance }
    const results = moveInstance.doMove({ G, ...restBgioArguments }, payload, context)

    console.log('results', results)

    


    return JSON.parse(serialize(G, { deduplicateInstances: false }))
  }
  compatibleMove.moveInstance = moveInstance
  return compatibleMove
}

function revivePayload (serializablePayload, G) {
  const payload = deserialize(JSON.stringify(serializablePayload), registry)
  payload.arguments =
    Object.entries(payload.arguments).reduce((acc, [key, entityId]) => ({
      ...acc,
      [key]: G.bank.locate(entityId)
    }), {})
  return payload
}
