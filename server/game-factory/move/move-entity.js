import Move from "./move.js";

export default class MoveEntity extends Move {
  do(bgioArguments, { arguments: { destination, entity } }) {
    bgioArguments.G.bank.findParent(entity)?.remove(entity)
    destination.placeEntity(entity, this.rule.position)
  }
}
