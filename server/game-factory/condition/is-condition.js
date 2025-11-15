import Condition from "./condition.js";
import entityMatches from '../utils/entity-matches.js'

export default class Is extends Condition {
  checkCondition(bgioArguments, rule, { target }, context) {
    console.log('------------')
    if (rule.blah) {
      console.log('context', context)
      console.log('this.rule.entity', this.rule.entity)
      console.log('rule.entity', rule.entity)
      console.log('target', target)
    }
    if (this.rule.entity && target !== rule.entity) {
      return {
        target,
        conditionIsMet: false,
      }
    }

    const x = {
      target,
      conditionIsMet: entityMatches(
        bgioArguments,
        rule.matcher,
        target,
        context
      )
    }
    if (rule.blah) {
      console.log('x', x)
    }
    return x
  }
}
