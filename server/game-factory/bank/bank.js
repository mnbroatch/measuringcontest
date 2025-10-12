import find from 'lodash/find.js'
import filter from 'lodash/filter.js'
import entityMatches from '../utils/entity-matches.js'
import checkConditions from '../utils/check-conditions.js'
import { registry } from '../registry.js'
import BankSlot from './bank-slot.js'

class Bank {
  constructor (entityRules) {
    this.currentEntityId = 0
    this.tracker = {}
    this.slots = entityRules.map(rule => new BankSlot(rule, this))
  }

  createEntity (definition, options) {
    const entity = new (registry[definition.type || 'Entity'])(
      {
        bank: this,
        fromBank: true,
        ...options
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

  findAll (bgioArguments, rule, context) {
    return filter(
      Object.values(this.tracker),
      (entity) => checkConditions(
        bgioArguments,
        rule,
        { target: entity },
        context
      ).conditionsAreMet
    )
  }

  findOne (bgioArguments, rule, context) {
    return this.findAll(bgioArguments, rule, context)[0]
  }

  findParent (entity) {
    return find(this.tracker, ent =>
      ent.entities?.includes(entity)
        || ent.spaces?.includes(entity)
    )
  }
 
  // consider separating state from matcher
  getOne (bgioArguments, matcher) {
    const slot = this.getSlot(bgioArguments, matcher)
    if (!slot) {
      console.error(`No matching slot for ${JSON.stringify(matcher)}`)
    }
    return slot.getOne({ state: matcher.state })
  }

  getMultiple (bgioArguments, matcher, count) {
    const slot = this.getSlot(bgioArguments, matcher)
    if (!slot) {
      console.error(`No matching slot for ${JSON.stringify(matcher)}`)
    }
    return slot.getMultiple(count, { state: matcher.state })
  }

  getSlot (bgioArguments, matcher) {
    return this.slots.find(slot => entityMatches(bgioArguments, matcher, slot))
  }

  returnToBank (bgioArguments, entity) {
    this.getSlot(bgioArguments, entity.rule).returnToBank(entity)
    delete this.tracker[entity.entityId]
  }
}

export default Bank
