import Entity from "../entity.js";
import Space from "../space/space.js";

export default class Spaces extends Entity {
  constructor (...args) {
    super(...args)
    this.spaces = this.makeSpaces();
  }

  makeSpaces () {
    return Array(this.getSpacesCount()).fill().map((_, i) => new Space(i))
  }

  getEmptySpaces() {
    return this.spaces.filter(space => space.isEmpty())
  }

  getSpace(index) {
    return this.spaces[index]
  }

  getEntities(index) {
    return this.getSpace(index).entities;
  }

  placeEntity(index, entity) {
    this.getSpace(index).placeEntity(entity);
  }
}
