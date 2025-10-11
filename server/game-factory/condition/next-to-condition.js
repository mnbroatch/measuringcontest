import _matches from "lodash/matches.js";
import Condition from "./condition.js";

export default class NextToCondition extends Condition {
  checkCondition(bgioArguments, payload) {
    const { target } = payload
    const matches = target.entities
      .filter(entity => entityMatches(bgioArguments, this.rule.entity, entity))
    return { matches, conditionIsMet: !!matches.length }
  }
}
