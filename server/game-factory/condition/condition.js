import { resolveArguments2 } from '../utils/resolve-arguments.js'

export default class Condition {
  constructor (rule) {
    this.rule = rule;
  }
  
  check (bgioArguments, payload = {}, context) {
    const { G } = bgioArguments
    const conditionPayload = {...payload}

    if (this.rule.target) {
      if (conditionPayload.target) {
        conditionPayload.originalTarget = conditionPayload.target
      }
      conditionPayload.target = resolveArguments2(
        bgioArguments,
        this.rule,
        conditionPayload.originalTarget,
        context
      )
    }
    if (this.rule.targets) {
      if (conditionPayload.targets) {
        conditionPayload.originalTargets = conditionPayload.targets
      }
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

    return this.checkCondition(bgioArguments, conditionPayload, context)
  }

  isMet(...args) {
    return this.check(...args).conditionIsMet
  }
}
