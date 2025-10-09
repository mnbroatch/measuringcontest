import find from 'lodash/find.js'
import filter from 'lodash/filter.js'
import matchesProperty from 'lodash/matchesProperty.js'
import { registry } from '../registry.js'
import BankSlot from './bank-slot.js'
import conditionFactory from "../condition/condition-factory.js";

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

  findAll (rule, bgioArguments = {}) {
    const { matches, conditions = [] } = rule
    const matcher = resolveMatcher(matches)
    return filter(
      Object.values(this.tracker),
      (entity) => matchesProperty('rule', matcher)(entity)
        && conditions.every(condition => conditionFactory(condition).isMet(bgioArguments, { target: entity }))
    )
  }

  findOne (rule, bgioArguments) {
    return this.findAll(rule, bgioArguments)[0]
  }

  findParent (entity) {
    return find(this.tracker, ent =>
      ent.entities?.includes(entity)
        || ent.spaces?.includes(entity)
    )
  }
 
  getOne (matcher, bgioArguments) {
    const entity = this.getSlot(resolveMatcher(matcher, bgioArguments)).getOne()
    return entity
  }

  getMultiple (matcher, count, bgioArguments) {
    const entities = this.getSlot(resolveMatcher(matcher, bgioArguments)).getMultiple(count)
    return entities
  }

  getSlot (matcher, bgioArguments) {
    return find(this.slots, matchesProperty('entityRule', resolveMatcher(matcher, bgioArguments)))
  }

  put (entity) {
    this.getSlot(entity.rule).put(entity)
    delete this.tracker[entity.entityId]
  }
}

function resolveMatcher (matcher, bgioArguments) {
  const resolvedMatcher = { ...matcher }
  if (matcher.player === 'Current') {
    resolvedMatcher.player = bgioArguments.ctx.currentPlayer
  }
  return resolvedMatcher
}

export default Bank
