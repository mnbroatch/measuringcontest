export default class Space {
  constructor(coordinates, startingPieces) {
    this.coordinates = coordinates;
    this.pieces = startingPieces;
    this.id = `${Math.random()}`
  }

  placePiece(piece) {
    this.pieces.push(piece);
  }

  isEmpty() {
    return this.pieces.length === 0;
  }
}
