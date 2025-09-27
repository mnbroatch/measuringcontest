import Move from "./move.js";

export default class MoveEntity extends Action {
  do(G, ctx, payload) {
    payload.destination.placeEntity(payload.entity);
  }
}
