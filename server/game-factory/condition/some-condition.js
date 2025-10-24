import Condition from "./condition.js";
import checkConditions from "../utils/check-conditions.js";

export default class SomeCondition extends Condition {
  checkCondition(bgioArguments, { target: targets }, context) {
    console.log('targets', targets)
    const results = targets.map((target) => {
      const loopContext = {
        ...context,
        loopTarget: target
      }
      const payload = { arguments: {} }
      const resolvedPayload = {
        arguments: resolveArguments(
          bgioArguments,
          this.rule.move,
          payload,
          loopContext
        )
      }

      return checkConditions(
        bgioArguments,
        this.rule,
        resolvedPayload,
        context
      )
    })

    return {
      conditionIsMet: results.some(r => r.conditionIsMet),
      results
    }
  }
}
