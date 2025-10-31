import Condition from "./condition.js";
import checkConditions from "../utils/check-conditions.js";

export default class EveryCondition extends Condition {
  checkCondition(bgioArguments, { target: targets }, context) {
    const results = targets.map((target) => {
      const loopContext = {
        ...context,
        loopTarget: target
      }

      return checkConditions(
        bgioArguments,
        this.rule,
        undefined,
        loopContext
      )
    })

    return {
      conditionIsMet: results.every(r => r.conditionsAreMet),
      results
    }
  }
}
