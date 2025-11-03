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

    const newContext = { ...context }

    if (conditionPayload.target) {
      newContext.originalTarget = conditionPayload.target
    }

    if (rule.target !== undefined) {
      // if it's an instance, we already found it. This would happen for example
      // by using context.loopTarget as a condition target
      conditionPayload.target = isPlainObject(rule.target)
        ? G.bank.find(bgioArguments, rule.target, newContext)
        : rule.target
    } else {
      conditionPayload.target = isPlainObject(payload.target)
        ? G.bank.find(bgioArguments, payload.target, newContext)
        : payload.target
    }

    if (rule.targets) {
      conditionPayload.targets = rule.targets.reduce((acc, targetRule) => [
        ...acc,
        ...G.bank.findAll(bgioArguments, targetRule, newContext)
      ], [])
    }

    if (rule.matcher.player !== undefined && rule.matcher.name === 'score') {
      console.log('rule', rule)
      console.log('conditionPayload', conditionPayload)
    }

    if (
      (rule.target !== undefined || rule.targets !== undefined)
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
