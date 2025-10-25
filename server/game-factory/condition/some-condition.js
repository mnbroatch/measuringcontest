import Condition from "./condition.js";
import checkConditions from "../utils/check-conditions.js";
import resolveArguments from '../utils/resolve-arguments.js'

export default class SomeCondition extends Condition {
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
      conditionIsMet: results.some(r => r.conditionsAreMet),
      results
    }
  }
}
