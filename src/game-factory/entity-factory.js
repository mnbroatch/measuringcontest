import { registry } from './registry.js'

export default class EntityFactory {
  constructor () {
    this.id = -1
  }

  createEntity(definition) {
    return new (registry[definition.type || 'Entity'])(definition, this.id++)
  }
}
