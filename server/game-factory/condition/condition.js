import resolveProperties from "../utils/resolve-properties.js";

export default class Condition {
  constructor (rule) {
    this.rule = rule;
  }
  
  check (bgioArguments, payload = {}, context) {
    const { G } = bgioArguments
    const conditionPayload = {...payload}
    const newContext = { ...context }

    if (this.rule.target) {
      if (conditionPayload.target) {
        newContext.originalTarget = conditionPayload.target
      }
      conditionPayload.target = resolveProperties(
        bgioArguments,
        this.rule.target,
        newContext
      )
    }
    if (this.rule.targets) {
      conditionPayload.targets = this.rule.targets.reduce((acc, target) => [
        ...acc,
        ...G.bank.findAll(bgioArguments, target)
      ], [])
    }

    if (
      (this.rule.target || this.rule.targets)
        && !conditionPayload.target
        && !conditionPayload.targets?.length
    ) {
      return { conditionIsMet: false }
    }

    return this.checkCondition(bgioArguments, conditionPayload, newContext)
  }

  isMet(...args) {
    return this.check(...args).conditionIsMet
  }
}
