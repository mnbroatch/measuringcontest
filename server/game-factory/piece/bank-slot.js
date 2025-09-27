// lazily create pieces as needed, and also function as an index of pieces created
class BankSlot {
  constructor (entityRule, entityFactory) {
    this.entityFactory = entityFactory
    this.entityRule = entityRule
    this.pool = []
    this.count = entityRule.count
  }

  getOne () {
    return this.getMultiple(1)[0]
  }

  getMultiple (count) {
    const toReturn = []
    if (this.count === undefined || this.count >= count) {
      if (this.count) {
        this.count -= count
      }
      const remainder = count - this.pool.length
      toReturn.push(...this.pool.splice(0, count))

      if (remainder > 0) {
        toReturn.push(
          ...Array.from(new Array(remainder)).map(() =>
            this.entityFactory(this.entityRule)
          )
        )
      }
    }
    return toReturn
  }

  put (entity) {
    entity.state = {}
    if (this.count !== undefined) {
      this.count += 1
    }
    this.pool.push(entity)
  }
}

export default BankSlot
