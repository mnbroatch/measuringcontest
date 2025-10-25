import { resolveArguments2 } from '../utils/resolve-arguments.js'

export default class Condition {
  constructor (rule) {
    this.rule = rule;
  }
  
  check (bgioArguments, payload = {}, context) {
    const { G } = bgioArguments
    const conditionPayload = {...payload}

    // override specific rules with different targets
    // aka "can place here if this other space is not empty"
    // this will probably grow messy and want to be refactored
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

    // I don't love having this exception here; will we need more?
    // Need a better system for move args => condition target in general
    if (this.rule.type !== 'Evaluate') {
      // nonexistent relative spaces for instance fulfill no conditions ever
      if (!conditionPayload.target && !conditionPayload.targets?.length) {
        return { conditionIsMet: false }
      }
    }

    return this.checkCondition(bgioArguments, conditionPayload, context)
  }

  isMet(...args) {
    return this.check(...args).conditionIsMet
  }
}
