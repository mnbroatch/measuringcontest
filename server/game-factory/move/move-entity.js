import Move from "./move.js";

export default class MoveEntity extends Move {
  do(bgioArguments, { arguments: { entity, destination } }) {
    console.log('this.rule.arguments.entity', this.rule.arguments.entity)
    // todo: move all such things to always be multiple
    if (Array.isArray(entity)) {
      entity.forEach((e) => {
        bgioArguments.G.bank.findParent(e)?.remove(e)
        destination.placeEntity(e, this.rule.position)
      })
    } else {
      bgioArguments.G.bank.findParent(entity)?.remove(entity)
      destination.placeEntity(entity, this.rule.position)
    }
  }
}
