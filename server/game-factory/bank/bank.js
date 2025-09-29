import find from 'lodash/find.js'
import matchesProperty from 'lodash/matchesProperty.js'
import { registry } from '../registry.js'
import BankSlot from './bank-slot.js'

class Bank {
  constructor (entityRules) {
    this.currentEntityId = 0
    this.tracker = {}
    this.slots = entityRules.map(rule => new BankSlot(rule, this))
  }

  createEntity (definition) {
    const entity = new (registry[definition.type || 'Entity'])(
      {
        bank: this,
        fromBank: true
      },
      definition,
      this.currentEntityId++
    )
    this.track(entity)
    return entity
  }

  track (entity) {
    this.tracker[entity.entityId] = entity
  }
 
  locate (entityId) {
    return this.tracker[entityId]
  }

  findAll (matcher) {
    return find(Object.values(this.tracker), matchesProperty('rule', matcher))
  }

  getOne (matcher) {
    const entity = this.getSlot(matcher).getOne()
    return entity
  }

  getMultiple (matcher, count) {
    const entities = this.getSlot(matcher).getMultiple(count)
    return entities
  }

  getSlot (matcher) {
    return find(this.slots, matchesProperty('entityRule', matcher))
  }

  put (entity) {
    this.getSlot(entity.rule).put(entity)
    delete this.tracker[entity.entityId]
  }
}

export default Bank
