import Condition from "./condition.js";
import findMetCondition from "../utils/find-met-condition.js";

export default class Or extends Condition {
  checkCondition(bgioArguments, payload, context) {
    const result = findMetCondition(
      bgioArguments,
      this.rule,
      payload,
      context
    )
    return { conditionIsMet: !!result }
  }
}
