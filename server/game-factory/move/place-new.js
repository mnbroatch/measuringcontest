import Move from "./move.js";

export default class PlaceNew extends Move {
  do(bgioArguments, { arguments: { destination } }, context) {
    const entity = this.rule.matchMultiple
      ? bgioArguments.G.bank.getMultiple(bgioArguments, this.rule.entity, context)
      : bgioArguments.G.bank.getOne(bgioArguments, this.rule.entity, context)
    destination.placeEntity(entity, this.rule.position)
  }
}
