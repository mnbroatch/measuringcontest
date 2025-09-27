import { serialize, deserialize } from 'wackson'
import { INVALID_MOVE } from 'boardgame.io/dist/cjs/core.js';
import { registry } from '../registry.js'
import conditionFactory from '../condition/condition-factory.js'

export default class Move {
  constructor (rule) {
    this.rule = rule
    this.id = `${Math.random()}`

    const invariantConditionRules = [
      { type: 'pieceMatches', moveRule: this.rule },
    ]

    this.conditions = [
      ...invariantConditionRules,
      ...(this.rule.conditions || [])
    ].map(conditionFactory)
  }

  // maybe?
  isPartialValid (payload) {
  }

  isValid (_, payload) {
    const unmetConditions = this.conditions.filter(
      (condition) => !condition.isMet(payload)
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
    const compatibleMove = ({ G: serializableG, ...bgioArguments }, serializedPayload) => {
      const G = deserialize(JSON.stringify(serializableG), registry)
      const payload = deserialize(serializedPayload, registry)
      if (!this.isValid({ G, ...bgioArguments }, payload)) {
        return INVALID_MOVE
      } else {
        this.do({ G, ...bgioArguments }, payload)
        return JSON.parse(serialize(G))
      }
    }
    compatibleMove.isValid = this.isValid
    return compatibleMove
  }
}
