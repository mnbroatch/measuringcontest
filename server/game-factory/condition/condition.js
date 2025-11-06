import resolveProperties from "../utils/resolve-properties.js";

export default class Condition {
  constructor (rule) {
    this.rule = rule;
  }
  
  check (bgioArguments, payload = {}, context = {}) {
    const { G } = bgioArguments
    const conditionPayload = {...payload}

    const newContext = { ...context }
    if (conditionPayload.target) {
      newContext.originalTarget = conditionPayload.target
    }

    const rule = resolveProperties(
      bgioArguments,
      this.rule,
      newContext
    )

    // rule.target being null (versus undefined) here would mean Parent or
    // RelativePath resolution, for instance, is missing.
    conditionPayload.target = rule.target !== undefined
      ? rule.target
      : payload.target

    rule.target ?? payload.target

    if (rule.targets) {
      conditionPayload.targets = rule.targets.reduce((acc, targetRule) => [
        ...acc,
        ...G.bank.findAll(bgioArguments, targetRule, newContext)
      ], [])
    }

    if (
      (this.rule.target !== undefined || this.rule.targets !== undefined)
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
