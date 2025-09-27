import matches from "lodash/matches.js";
import Condition from "../condition/condition.js";

export default class DoesNotContainCondition extends Condition {
  isMet(_, payload) {
    const { space } = this.resolveMappings(payload)
    return !space.pieces.filter(matches(this.rule.piece)).length;
  }
}
