import entityFactory from '../entity-factory.js'

// all this extra complication is to support arbitrary (infinite) piles of entities
class Bank {
  constructor (entityRule, options = {}) {
    this.entityRule = entityRule
    this.name = entityRule.name
    this.id = `${Math.random()}`
    if (options.player) {
      this.player = options.player
    }
    this.options = options
    this.pool = (
      entityRule.variants ? Object.entries(entityRule.variants) : []
    ).reduce((acc, [variantId, variant]) => {
      const count = variant.count || 1
      return [
        ...acc,
        ...Array.from(Array(count)).map((_) =>
          entityFactory({ ...{ ...entityRule, variantId }, ...variant })
        )
      ]
    }, [])

    if (entityRule.shuffled) {
      this.pool = this.pool
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    }

    this.count = this.pool.length || entityRule.count
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
            entityFactory(this.entityRule, this.options)
          )
        )
      }
    }
    return toReturn
  }

  put (entity) {
    if (this.count !== undefined) {
      this.count += 1
    }
    this.pool.push(entity)
  }
}

export default Bank
