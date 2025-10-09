import _matches from "lodash/matches.js";
import Condition from "../condition/condition.js";

export default class ContainsCondition extends Condition {
  checkCondition(_, payload) {
    const { target } = payload
    if (!target) {
      return { matches: [], conditionIsMet: false }
    } else {
      const matches = target.entities.filter(e => _matches(this.rule.entity)(e.rule));
      return { matches, conditionIsMet: !!matches.length }
    }
  }
}
