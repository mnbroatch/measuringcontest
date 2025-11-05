import resolveProperties from "../utils/resolve-properties.js";
import resolveEntity from "../utils/resolve-entity.js";

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

    conditionPayload.target = resolveEntity(
      bgioArguments,
      rule.target !== undefined ? rule.target : payload.target,
      newContext
    )

    if (rule.targets) {
      conditionPayload.targets = rule.targets.reduce((acc, targetRule) => [
        ...acc,
        ...G.bank.findAll(bgioArguments, targetRule, newContext)
      ], [])
    }

    if (
      (rule.target !== undefined || rule.targets !== undefined)
        && !conditionPayload.target
        && !conditionPayload.targets?.length
    ) {
      return { conditionIsMet: false }
    }
    
    if (rule.type === 'Every') {
      console.log('---------')
      console.log('rule', rule)
      console.log('conditionPayload', conditionPayload)
      console.log('payload', payload)
      console.log('context', context)
    }
    return this.checkCondition(bgioArguments, rule, conditionPayload, newContext)
  }

  isMet(...args) {
    return this.check(...args).conditionIsMet
  }
}
