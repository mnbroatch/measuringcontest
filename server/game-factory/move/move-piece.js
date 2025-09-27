import Action from "./action.js";

export default class MovePieceAction extends Action {
  do(G, ctx, payload) {
    payload.destination.placeEntity(payload.piece);
  }
}
