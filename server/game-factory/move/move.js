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
    const unmetConditions = []
    this.conditionMappings.forEach(({ rule, mappings }) => {
      const condition = conditionFactory(rule)
      if (!condition.isMet(bgioArguments, this.resolveMappings(payload, mappings))) {
        unmetConditions.push(condition)
      }
    })
    if (unmetConditions.length) {
      console.log('==================')
      console.log('unmetConditions', unmetConditions)
      console.log('payload', payload)
    }
    return !unmetConditions.length
  }

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
      const payload = revivePayload(serializablePayload, G)


      if (!this.isValid(bgioArguments, payload)) {
        return INVALID_MOVE
      } else {
        this.do(bgioArguments, payload)
        return JSON.parse(serialize(G))
      }
    }

    compatibleMove.moveInstance = this
    return compatibleMove
  }

  resolveMappings (payload, mappings) {
    return Object.entries((mappings || []))
      .reduce((acc, [property, mapping]) => ({
        ...acc,
        [property]: mapping(payload)
      }), {})
  }

  do () {}
}


function revivePayload (serializablePayload, G) {
  const payload = deserialize(JSON.stringify(serializablePayload), registry)
  payload.entities =
    Object.entries(payload.entities).reduce((acc, [key, entityId]) => ({
      ...acc,
      [key]: G.bank.locate(entityId)
    }), {})
  return payload
}
