export default class Entity {
  constructor (options, rule, id) {
    if (!options?.fromFactory) {
      throw new Error(`Do not create entities directly. Go through the Bank. rule: ${rule}`)
    }
    this.rule = rule
    this.entityId = id
  }
}
