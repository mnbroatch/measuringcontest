import _matches from "lodash/matches.js";
import Condition from "../condition/condition.js";
import entityMatches from "../utils/entity-matches.js";

export default class ContainsCondition extends Condition {
  checkCondition(bgioArguments, payload) {
    const { target } = payload
    if (!target) {
      return { matches: [], conditionIsMet: false }
    } else {
      const matches = target.entities.filter(entity => entityMatches(bgioArguments, this.rule.matcher, entity))
      return { matches, conditionIsMet: !!matches.length }
    }
  }
}
