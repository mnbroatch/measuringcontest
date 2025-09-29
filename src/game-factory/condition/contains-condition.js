import matches from "lodash/matches.js";
import Condition from "../condition/condition.js";

export default class ContainsCondition extends Condition {
  isMet(_, payload) {
    const { target } = payload
    return target.entities.filter(matches(this.rule.entity)).length;
  }
}
