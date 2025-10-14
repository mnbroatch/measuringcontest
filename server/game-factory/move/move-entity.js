import Move from "./move.js";

export default class MoveEntity extends Move {
  do(_, { arguments: { destination, entity } }) {
    destination.placeEntity(entity)
  }
}
