import isMatch from 'lodash/isMatch.js'
import BankSlot from './bank-slot.js'

class Bank {
  constructor (entityRules) {
    this.slots = entityRules.map(rule => new BankSlot(rule))
  }

  findAll (matcher) {
    return this.getSlot(matcher).tracker
  }

  getOne (matcher) {
    return this.getSlot(matcher).getOne(count)
  }

  getMultiple (matcher, count) {
    return this.getSlot(matcher).getMultiple(count)
  }

  getSlot (matcher) {
    return this.slots.find(s => isMatch(s.entityRule, matcher))
  }
}

export default Bank
