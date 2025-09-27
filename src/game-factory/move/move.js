import { serialize, deserialize } from 'wackson'
import { INVALID_MOVE } from 'boardgame.io/dist/cjs/core.js';
import { registry } from '../registry.js'
import conditionFactory from '../condition/condition-factory.js'

export default class Move {
  constructor (rule) {
    this.rule = rule
    this.id = `${Math.random()}`
    this.conditionMappings = [
      {
        rule: { type: 'doesNotContain' },
        mappings: { space: payload => payload.destination }
      },
      {
        rule: {
          type: 'bankHasEnough',
          piece: {
            name: "playerMarker",
            player: "current"
          }
        },
        mappings: { entity: () => rule.entity }
      },
    ]
  }

  // maybe?
  isPartialValid (payload) {
  }

  isValid (_, payload) {
    const conditions = (this.conditionMappings || [])
      .map(({ rule, mappings }) => conditionFactory(rule, mappings))
    const unmetConditions = conditions.filter(
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
    const compatibleMove = (
      {
        G: serializableG,
        ...restBgioArguments
      },
      serializedPayload
    ) => {
      const G = deserialize(JSON.stringify(serializableG), registry)
      const bgioArguments = { G, ...restBgioArguments }
      const payload = deserialize(serializedPayload, registry)

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
