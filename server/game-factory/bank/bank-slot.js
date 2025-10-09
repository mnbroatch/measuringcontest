// lazily create entities as needed, and also function as an index of entities created
class BankSlot {
  constructor (entityRule, bank) {
    this.bank = bank
    this.entityRule = entityRule
    this.pool = []
    this.remaining = +entityRule.count || 1
  }

  getOne () {
    return this.getMultiple(1)[0]
  }

  getMultiple (count) {
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
            this.bank.createEntity(this.entityRule)
          )
        )
      }
    }
    return toReturn
  }

  return (entity) {
    entity.state = {}
    if (this.remaining !== undefined) {
      this.remaining += 1
    }
    this.pool.push(entity)
  }
}

export default BankSlot
