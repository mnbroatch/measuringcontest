import _matches from "lodash/matches.js";
import Condition from "../condition/condition.js";

export default class ContainsCondition extends Condition {
  isConditionMet(_, payload) {
    const { target } = payload
    const matches = target.entities.filter(_matches(this.rule.entity));
    return { matches, conditionIsMet: !!matches.length }
  }
}
