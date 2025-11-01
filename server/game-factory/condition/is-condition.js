import Condition from "./condition.js";
import entityMatches from '../utils/entity-matches.js'

export default class Is extends Condition {
  checkCondition(bgioArguments, rule, { target }, context) {
    return {
      target,
      conditionIsMet: entityMatches(
        bgioArguments,
        rule.matcher,
        target,
        context
      )
    }
  }
}
