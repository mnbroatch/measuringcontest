export default class Entity {
  constructor (rule, id, { fromFactory }) {
    if (!fromFactory) {
      throw new Error(`Do not create entities directly. Go through the Bank.`)
    }
    this.rule = rule
    this.entityId = id
  }
}
