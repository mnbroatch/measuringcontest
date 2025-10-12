import Condition from "./condition.js";
import checkConditions from "../utils/check-conditions.js";

export default class NotCondition extends Condition {
  checkCondition(bgioArguments, payload, context) {
    const { conditionsAreMet } = checkConditions(
      bgioArguments,
      this.rule,
      payload,
      context
    )
    return { conditionIsMet: !conditionsAreMet }
  }
}
