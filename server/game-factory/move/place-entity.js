import Move from "./move.js";

export default class PlaceEntity extends Move {
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

    // bring back pieceMatches for if rule.destination had more properties?
    // not that I really know what properties a space has but keep pattern in mind
    const spaceConditionMappings = rule.destination.conditions.map(rule => ({
      rule,
      mappings: { target: payload => payload.entities.destination }
    }))

    this.conditionMappings = [
      // ...invariantConditionMappings,
      ...spaceConditionMappings,
    ]
  }

  do({ G, ctx }, { entities: { destination } }) {
    const entityRuleCopy = {...this.rule.entity}
    if (entityRuleCopy.player === 'Current') {
      entityRuleCopy.player = ctx.currentPlayer
    }
    destination.placeEntity(G.bank.getOne(entityRuleCopy))
  }
}
