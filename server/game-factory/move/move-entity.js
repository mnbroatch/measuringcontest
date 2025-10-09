import Move from "./move.js";

export default class MoveEntity extends Move {
  constructor (rule) {
    super (rule)

    // const invariantConditionMappings = [
    //   {
    //     rule: {
    //       type: 'bankHasEnough',
    //       entity: rule.entity
    //     }
    //   },
    // ]

    const spaceConditionMappings = rule.arguments.destination.conditions?.map(rule => ({
      rule,
      mappings: { target: payload => payload.arguments.destination }
    })) || []

    this.conditionMappings = [
      // ...invariantConditionMappings,
      ...spaceConditionMappings,
    ]
  }

  do(_, { arguments: { destination, entity } }) {
    destination.placeEntity(entity)
  }
}
