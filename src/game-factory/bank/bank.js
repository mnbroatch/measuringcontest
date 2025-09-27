import isMatch from 'lodash/isMatch'
import BankSlot from './bank-slot.js'
import makeEntityFactory from '../entity-factory.js'

class Bank {
  constructor (entityRules) {
    const entityFactory = makeEntityFactory()
    this.tracker = {}
    this.slots = entityRules.map(rule => new BankSlot(rule, entityFactory))
  }

  track (entity) {
    this.tracker[entity.entityId] = entity
  }
 
  locate (entityId) {
    return this.tracker[entityId]
  }

  getOne (matcher) {
    const entity = this.getSlot(matcher).getOne()
    this.track(entity)
    return entity
  }

  getMultiple (matcher, count) {
    const entities = this.getSlot(matcher).getMultiple(count)
    entities.forEach((entity) => { this.track(entity) })
    return entities
  }

  getSlot (matcher) {
    return this.slots.find(s => isMatch(s.entityRule, matcher))
  }

  put (entity) {
    this.getSlot(entity.rule).put(entity)
    delete this.tracker[entityId]
  }
}

export default Bank
