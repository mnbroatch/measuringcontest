export default class Condition {
  constructor (rule) {
    this.rule = rule;
  }

  check (bgioArguments, payload = {}) {
    const { G } = bgioArguments
    const conditionPayload = {...payload}

    // override specific rules with different targets
    // aka "can place here if this other space is not empty"
    if (this.rule.target) {
      if (conditionPayload.target) {
        conditionPayload.originalTarget = conditionPayload.target
      }
      conditionPayload.target = G.bank.findAll(
        {
          ...this.rule,
          matches: this.rule.target
        })[0]
    }
    if (this.rule.targets) {
      if (conditionPayload.targets) {
        conditionPayload.originalTargets = conditionPayload.targets
      }
      conditionPayload.targets = this.rule.targets.reduce((acc, target) => [
        ...acc,
        ...G.bank.findAll({ matches: target })
      ], [])
    }

    return this.checkCondition(bgioArguments, conditionPayload)
  }

  isMet(...args) {
    return this.check(...args).conditionIsMet
  }
}
