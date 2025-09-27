export default class Condition {
  constructor (rule, mappings) {
    this.id = `${Math.random()}`
    this.rule = rule;
    this.mappings = mappings;
  }

  resolveMappings (payload) {
    return Object.entries((this.mappings || []))
      .reduce((acc, [property, mapping]) => ({
        ...acc,
        [property]: mapping(payload)
      }), {})
  }

  isMet() {}
}
