import Move from "./move.js";

export default class TakeFrom extends Move {
  do(bgioArguments, { arguments: { source, destination } }) {
    destination.placeEntity(source.takeOne(this.rule.arguments.source.position))
  }
}
