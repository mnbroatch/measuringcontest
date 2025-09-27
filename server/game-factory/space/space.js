import Entity from "../entity.js";

export default class Space extends Entity {
  constructor (...args) {
    super(...args)
    this.entities = []
  }

  placeEntity(entity) {
    this.entities.push(entity);
  }

  isEmpty() {
    return this.entities.length === 0;
  }
}
