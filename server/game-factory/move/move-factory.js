import { serialize, deserialize } from 'wackson'
import { registry } from '../registry.js'
import MoveEntity from "./move-entity.js";
import SetState from "./set-state.js";
import SetActivePlayers from "./set-active-players.js";
import EndTurn from "./end-turn.js";
import ForEach from "./for-each.js";
import Pass from "./pass.js";
import Shuffle from "./shuffle.js";
// import Swap from "./swap.js";

export default function moveFactory(moveRule) {
  const moveInstance = getMoveInstance(moveRule)

  // accepts serialized G and payload, returns serialized
  const compatibleMove = function (
    {
      G: serializableG,
      ...restBgioArguments
    },
    serializablePayload,
  ) {
    const G = deserialize(JSON.stringify(serializableG), registry)
    const payload = revivePayload(serializablePayload, G)
    const bgioArguments = { G, ...restBgioArguments }
    const context = { moveInstance }
    const moveConditionResults = moveInstance.doMove(bgioArguments, payload, context)

    context.moveConditionResults = [moveConditionResults]

    if (moveRule.then) {
      for (let automaticMoveRule of moveRule.then) {
        const result = getMoveInstance(automaticMoveRule).doMove(bgioArguments, {}, context)
        context.moveConditionResults.push(result)
          context
      }
    }

    return JSON.parse(serialize(G))
  }
  compatibleMove.moveInstance = moveInstance
  return compatibleMove
}

function revivePayload (serializablePayload, G) {
  if (serializablePayload) {
    const payload = deserialize(JSON.stringify(serializablePayload), registry)
    payload.arguments =
      Object.entries(payload.arguments).reduce((acc, [key, argOrEntityId]) => ({
        ...acc,
        [key]: typeof argOrEntityId === 'number' ? G.bank.locate(argOrEntityId) : argOrEntityId
      }), {})
    return payload
  } else {
    return serializablePayload
  }
}

export function getMoveInstance (moveRule) {
  switch (moveRule.type) {
    case 'MoveEntity':
      return new MoveEntity(moveRule);
    case 'SetState':
      return new SetState(moveRule);
    case 'ForEach':
      return new ForEach(moveRule);
    case 'Pass':
      return new Pass(moveRule);
    case 'Shuffle':
      return new Shuffle(moveRule);
    case 'SetActivePlayers':
      return new SetActivePlayers(moveRule);
    case 'EndTurn':
      return new EndTurn(moveRule);
  }
}
