import { serialize, deserialize } from 'wackson'
import { INVALID_MOVE } from 'boardgame.io/dist/cjs/core.js';
import { registry } from '../registry.js'
import conditionFactory from '../condition/condition-factory.js'

export default class Move {
  constructor (rule) {
    this.rule = rule
  }

  // maybe?
  isPartialValid (payload) {
  }

  isValid (bgioArguments, payload) {
    const conditions = (this.conditionMappings || []).map(conditionFactory)
    const unmetConditions = conditions.filter(
      (condition) => !condition.isMet(bgioArguments, payload)
    )
    if (unmetConditions.length) {
      console.log('==================')
      console.log('unmetConditions', unmetConditions)
      console.log('payload', payload)
    }
    return !unmetConditions.length
  }

  do () {}

  // arguments and G must be serializable for bgio to work
  createBoardgameIOCompatibleMove () {
    const compatibleMove = (
      {
        G: serializableG,
        ...restBgioArguments
      },
      serializablePayload
    ) => {
      const G = deserialize(JSON.stringify(serializableG), registry)
      const bgioArguments = { G, ...restBgioArguments }
      const payload = revivePayload(serializablePayload)


      if (!this.isValid(bgioArguments, payload)) {
        return INVALID_MOVE
      } else {
        this.do(bgioArguments, payload)
        return JSON.parse(serialize(G))
      }
    }
    compatibleMove.isValid = this.isValid
    return compatibleMove
  }
}


function revivePayload (serializablePayload) {
  const payload = deserialize(JSON.stringify(serializablePayload), registry)
  payload.entities =
    Object.entries(payload.entities).reduce((acc, [key, entityId]) => ({
      ...acc,
      [key]: G.bank.locate(entityId)
    }), {})
  return payload
}
