import Entity from "../entity.js";

export default class Space extends Entity {
  constructor (...args) {
    super(...args)
    this.entities = []
  }

  placeEntity(entity: Entity) {
    this.entities.push(entity);
  }

  isEmpty(): boolean {
    return this.entities.length === 0;
  }
}
