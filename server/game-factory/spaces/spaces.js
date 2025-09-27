import Space from "../space/space.js";

export default class Spaces {
  constructor (rule, options = {}) {
    this.rule = rule
    this.spaces = this.makeSpaces();
  }

  makeSpaces () {
    return Array(this.getSpacesCount()).map((_, i) => new Space(i))
  }

  getEmptySpaces() {
    const emptySpaces = this.spaces.filter(space => space.isEmpty())
  }

  getSpace(index) {
    return this.spaces[index]
  }

  getPieces(index) {
    return this.getSpace(index).pieces;
  }

  placePiece(index, piece) {
    this.getSpace(index).placePiece(piece);
  }
}
