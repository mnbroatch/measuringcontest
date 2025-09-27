import Entity from "../entity.js";

export default class Spaces extends Entity {
  constructor (options, ...rest) {
    super(options, ...rest)
    this.spaces = this.makeSpaces(options.entityFactory);
  }

  makeSpaces (entityFactory) {
    return Array(this.getSpacesCount()).fill()
      .map((_, i) => entityFactory.createEntity({ type: 'space', index: `${i}` }))
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
