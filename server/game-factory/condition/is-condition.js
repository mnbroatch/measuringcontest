import Condition from "./condition.js";
import entityMatches from '../utils/entity-matches.js'

export default class Is extends Condition {
  checkCondition(bgioArguments, { target }, context) {
    return {
      target,
      conditionIsMet: entityMatches(
        bgioArguments,
        this.rule.matcher,
        target,
        context
      )
    }
  }
}
