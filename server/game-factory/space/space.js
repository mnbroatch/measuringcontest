import Entity from "../entity.js";

export default class Space extends Entity {
  constructor (...args) {
    super(...args)
    this.entities = []
  }

  placeEntity (entity, position = 'Last') {
    if (position === 'Last') {
      this.entities.push(entity);
    } else if (position === 'First') {
      this.entities.unshift(entity);
    }
  }

  remove (entity) {
    this.entities.splice(this.entities.indexOf(entity), 1);
  }

  isEmpty() {
    return this.entities.length === 0;
  }
}
