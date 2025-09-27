export default class Piece {
  constructor(pieceRule) {
    this.rule = pieceRule;
    this.id = `${Math.random()}`
  }
}
