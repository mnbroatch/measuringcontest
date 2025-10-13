import resolveProperties from '../utils/resolve-properties.js'

// lazily create entities as needed, and also function as an index of entities created
class BankSlot {
  constructor (rule, bank) {
    this.bank = bank
    this.rule = rule
    this.pool = []
    this.remaining = +rule.count || 1
  }

  getOne (bgioArguments, options) {
    return this.getMultiple(bgioArguments, 1, options)[0]
  }

  getMultiple (bgioArguments, count, options) {
    const toReturn = []
    if (this.remaining >= count) {
      if (this.remaining) {
        this.remaining -= count
      }
      const remainder = count - this.pool.length
      toReturn.push(...this.pool.splice(0, count))

      if (remainder > 0) {
        toReturn.push(
          ...Array.from(new Array(remainder)).map(() =>
            this.bank.createEntity(this.rule)
          )
        )
      }
    }
    if (options.state) {
      toReturn.forEach(entity => {
        entity.state = { ...entity.state, ...resolveProperties(bgioArguments, options.state) }
      })
    }
    return toReturn
  }

  returnToBank (entity) {
    entity.state = {}
    if (this.remaining !== undefined) {
      this.remaining += 1
    }
    this.pool.push(entity)
  }
}

export default BankSlot
