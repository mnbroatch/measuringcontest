import Condition from "./condition.js";
import checkConditions from "../utils/check-conditions.js";

export default class SomeCondition extends Condition {
  checkCondition(bgioArguments, payload, context) {
    const { results } = checkConditions(
      bgioArguments,
      this.rule,
      payload,
      context,
      true
    )
    return { conditionIsMet: results.some(r => r.conditionIsMet) }
  }
}
