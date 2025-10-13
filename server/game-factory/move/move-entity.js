import Move from "./move.js";

export default class MoveEntity extends Move {
  constructor (rule) {
    super (rule)

    this.conditionMappings = {
      move: {
        conditions: rule.conditions,
        getPayload: payload => payload
      },
      ...Object.entries(rule.arguments).reduce((acc, [argName, argRule]) => ({
        ...acc,
        [argName]: {
          conditions: argRule.conditions,
          getPayload: payload => ({
            ...payload,
            target: payload.arguments[argName]
          })
        }
      }), {})
    }
  }

  do(_, { arguments: { destination, entity } }) {
    console.log('destination', destination)
    console.log('entity', entity)
    destination.placeEntity(entity)
  }
}
