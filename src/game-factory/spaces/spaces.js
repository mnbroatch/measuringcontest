import Entity from "../entity.js";

export default class Spaces extends Entity {
  constructor (options, ...rest) {
    super(options, ...rest)
    this.spaces = this.makeSpaces(options.bank);
  }

  makeSpaces (bank) {
    return Array(this.getSpacesCount()).fill()
      .map(() => bank.createEntity({ type: 'Space' }))
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
