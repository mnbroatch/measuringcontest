import isPlainObject from "lodash/isPlainObject.js";
import resolveProperties from "../utils/resolve-properties.js";

export default class Condition {
  constructor (rule) {
    this.rule = rule;
  }
  
  check (bgioArguments, payload = {}, context = {}) {
    const { G } = bgioArguments
    const conditionPayload = {...payload}

    const rule = resolveProperties(
      bgioArguments,
      this.rule,
      context,
      true
    )
    console.log('payload.target', payload.target)
    console.log('rule.target', rule.target)

    const newContext = { ...context }

    if (conditionPayload.target) {
      newContext.originalTarget = conditionPayload.target
    }

    // wip: maybe get rid of the condition
    if (rule.target) {
      // if it's an instance, we already found it. This would happen for example
      // by using context.loopTarget as a condition target
      conditionPayload.target = isPlainObject(rule.target)
        ? G.bank.find(bgioArguments, rule.target, newContext)
        : rule.target
    }

    if (rule.targets) {
      conditionPayload.targets = rule.targets.reduce((acc, targetRule) => [
        ...acc,
        ...G.bank.findAll(bgioArguments, targetRule, newContext)
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
