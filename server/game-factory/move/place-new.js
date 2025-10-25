import Move from "./move.js";

export default class PlaceNew extends Move {
  do(bgioArguments, { arguments: { destination } }, context) {
    const entities = this.rule.matchMultiple
      ? bgioArguments.G.bank.getMultiple(bgioArguments, this.rule.entity, this.rule.count, context)
      : [bgioArguments.G.bank.getOne(bgioArguments, this.rule.entity, context)]
    entities.forEach((entity) => {
      destination.placeEntity(entity, this.rule.position)
    })
  }
}
