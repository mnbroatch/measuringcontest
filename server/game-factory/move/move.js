import { serialize, deserialize } from 'wackson'
import { INVALID_MOVE } from 'boardgame.io/dist/cjs/core.js';
import { registry } from '../registry.js'
import conditionFactory from '../condition/condition-factory.js'

export default class Move {
  constructor (rule) {
    this.rule = rule
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
      const payload = revivePayload(serializablePayload, G)
      this.doMove({ G, ...restBgioArguments }, payload)
      return JSON.parse(serialize(G, { deduplicateInstances: false }))
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

  resolveArguments (bgioArguments, payload) {
    return Object.entries(this.rule.arguments).reduce((acc, [argName, argRule]) => {
      let argument = payload?.arguments[argName]
      if (!argument) {
        if (!argRule.automatic) {
          console.error(`non-automatic move rule didn't get argument: ${argName} in ${JSON.stringify(this.rule)}`)
        }
        if (argRule.location === 'bank') {
          argument = bgioArguments.G.bank.getOne(bgioArguments, argRule.matches)
        } else {
          argument = bgioArguments.G.bank.findOne(bgioArguments, argRule)
        }
      }
      return {...acc, [argName]: argument}
    }, {})
  }


  doMove (bgioArguments, payload) {
    const resolvedPayload = {
      ...payload,
      arguments: this.resolveArguments(bgioArguments, payload)
    }

    if (!this.isValid(bgioArguments, resolvedPayload)) {
      return INVALID_MOVE
    } else {
      this.do(bgioArguments, resolvedPayload)
      return bgioArguments.G
    }
  }
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
