export default class Condition {
  constructor (rule) {
    this.rule = rule;
  }

  isMet(bgioArguments, payload = {}) {
    const { G } = bgioArguments
    const conditionPayload = {...payload}
    // probably standardize these more, always use targets?
    if (this.rule.target && !payload.target) {
      conditionPayload.target = G.bank.findAll(this.rule.target)[0]
    }
    if (this.rule.targets && !payload.targets) {
      conditionPayload.targets = this.rule.targets.reduce((acc, target) => [
        ...acc,
        ...G.bank.findAll(target)
      ], [])
    }
    return this.isConditionMet(bgioArguments, conditionPayload).conditionIsMet
  }
}
