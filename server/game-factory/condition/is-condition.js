import Condition from "./condition.js";
import entityMatches from '../utils/entity-matches.js'

export default class Is extends Condition {
  checkCondition(bgioArguments, rule, { target }, context) {
    if (rule.entity && target !== rule.entity) {
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
    if (rule.blah) console.log('x', x)
    return x
  }
}
