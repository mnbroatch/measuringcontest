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

  findAll (bgioArguments, rule) {
    const { matches, conditions = [] } = rule
    const matcher = resolveMatcher(bgioArguments, matches)
    return filter(
      Object.values(this.tracker),
      (entity) => matchesProperty('rule', matcher)(entity)
        && conditions.every(condition => conditionFactory(condition).isMet(bgioArguments, { target: entity }))
    )
  }

  findOne (bgioArguments, rule) {
    return this.findAll(bgioArguments, rule)[0]
  }

  findParent (entity) {
    return find(this.tracker, ent =>
      ent.entities?.includes(entity)
        || ent.spaces?.includes(entity)
    )
  }
 
  getOne (bgioArguments, matcher) {
    const entity = this.getSlot(bgioArguments, resolveMatcher(bgioArguments, matcher)).getOne()
    return entity
  }

  getMultiple (bgioArguments, matcher, count) {
    const entities = this.getSlot(bgioArguments, resolveMatcher(bgioArguments, matcher)).getMultiple(count)
    return entities
  }

  getSlot (bgioArguments, matcher) {
    return find(this.slots, matchesProperty('entityRule', resolveMatcher(bgioArguments, matcher)))
  }

  return (bgioArguments, entity) {
    this.getSlot(bgioArguments, resolveMatcher(bgioArguments, entity.rule)).return(entity)
    delete this.tracker[entity.entityId]
  }
}

function resolveMatcher (bgioArguments, matcher) {
  const resolvedMatcher = { ...matcher }
  if (matcher.player === 'Current') {
    resolvedMatcher.player = bgioArguments.ctx.currentPlayer
  }
  return resolvedMatcher
}

export default Bank
