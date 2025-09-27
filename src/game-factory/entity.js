export default class Entity {
  constructor (rule, id, options) {
    if (!options?.fromFactory) {
      throw new Error(`Do not create entities directly. Go through the Bank. rule: ${rule}`)
    }
    this.rule = rule
    this.entityId = id
  }
}
