import Move from "./move.js";

export default class MoveEntity extends Move {
  do(bgioArguments, { arguments: { destination, entity } }) {
    if (this.rule.arguments.entity.location !== 'Bank') {
      bgioArguments.G.bank.findParent(entity).remove(entity)
    }
    destination.placeEntity(entity)
  }
}
