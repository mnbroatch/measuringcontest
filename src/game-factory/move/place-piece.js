import Action from "./action.js";
import resolvePiece from "../resolve-piece.js";

export default class MovePiece extends Action {
  do(G, ctx, payload) {
    const piece = 
    payload.destination.placePiece(payload.piece);
  }
}
