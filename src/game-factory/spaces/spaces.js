import Space from "../space/space.ts";

export default class Spaces {
  constructor (rule, options = {}) {
    this.rule = rule
    this.spaces = this.makeSpaces();
    console.log('this.spaces', this.spaces)
  }

  makeSpaces () {
    return Array(this.getSpacesCount()).map((_, i) => new Space(i))
  }

  getEmptySpaces() {
    return this.spaces.filter(space => space.isEmpty())
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
