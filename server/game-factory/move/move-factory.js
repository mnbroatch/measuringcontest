import { serialize, deserialize } from 'wackson'
import { registry } from '../registry.js'
import MoveEntity from "./move-entity.js";
// import Swap from "./swap.js";

export default function moveFactory(moveRule) {
  const moveInstance = getMoveInstance(moveRule)

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
    const bgioArguments = { G, ...restBgioArguments }
    const context = { moveInstance }
    const moveResult = moveInstance.doMove(bgioArguments, payload, context)

    context.moveResults = [moveResult]

    if (moveRule.then) {
      for (let automaticMoveRule of moveRule.then) {
        const result = getMoveInstance(automaticMoveRule).doMove(bgioArguments, {}, context)
        context.moveResults.push(result)
      }
    }

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

function getMoveInstance (moveRule) {
  switch (moveRule.type) {
    case 'MoveEntity':
      return new MoveEntity(moveRule);
  }
}
