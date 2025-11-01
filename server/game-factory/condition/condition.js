import resolveProperties from "../utils/resolve-properties.js";

export default class Condition {
  constructor (rule) {
    this.rule = rule;
  }
  
  check (bgioArguments, payload = {}, context) {
    const { G } = bgioArguments
    const conditionPayload = {...payload}

    const rule = resolveProperties(
      bgioArguments,
      this.rule,
      context,
      true
    )

    const newContext = { ...context }

    if (rule.target) {
      if (conditionPayload.target) {
        newContext.originalTarget = conditionPayload.target
      }
    }

    if (rule.targets) {
      conditionPayload.targets = rule.targets.reduce((acc, target) => [
        ...acc,
        ...G.bank.findAll(bgioArguments, target)
      ], [])
    }

    if (
      (rule.target || rule.targets)
        && !conditionPayload.target
        && !conditionPayload.targets?.length
    ) {
      return { conditionIsMet: false }
    }

    return this.checkCondition(bgioArguments, rule, conditionPayload, newContext)
  }

  isMet(...args) {
    return this.check(...args).conditionIsMet
  }
}
