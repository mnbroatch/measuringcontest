import Condition from "./condition.js";
import checkConditions from "../utils/check-conditions.js";

export default class NotCondition extends Condition {
  checkCondition(bgioArguments, payload, context) {
    console.log('this.rule', this.rule)
    console.log('payload', payload)
    const { conditionsAreMet } = checkConditions(
      bgioArguments,
      this.rule,
      payload,
      context
    )
    return { conditionIsMet: !conditionsAreMet }
  }
}
