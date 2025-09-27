import type { PieceRule } from "../../types";

export default class Piece {
  rule: PieceRule;
  constructor(pieceRule: PieceRule) {
    this.rule = pieceRule;
    this.id = `${Math.random()}`
  }
}
