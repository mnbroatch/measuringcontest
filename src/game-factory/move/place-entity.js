import Move from "./move.js";

export default class PlaceEntity extends Move {
  constructor (moveRule) {
    super (moveRule)

    const invariantConditionMappings = [
      {
        rule: {
          type: 'bankHasEnough',
          entity: moveRule.entity
        }
      },
    ]

    const spaceConditionMappings = moveRule.destination.conditions.map(rule => ({
      rule,
      mappings: { space: payload => payload.destination }
    }))

    this.conditionMappings = [
      // ...invariantConditionMappings,
      ...spaceConditionMappings,
    ]
  }

  do(G, ctx, { destination }) {
    const entityRuleCopy = {...entityRule}
    if (entityRuleCopy.player === 'Current') {
      entityRuleCopy.player = ctx.currentPlayer
    }
    destination.placeEntity(G.bank.getOne(entityRuleCopy))
  }
}
