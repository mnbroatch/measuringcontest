import Condition from "./condition.js";
import checkConditions from "../utils/check-conditions.js";
import simulateMove from "../utils/simulate-move.js";

export default class WouldCondition extends Condition {
  checkCondition(bgioArguments, payload, context) {
    const { simulatedG, simulatedPayload } = simulateMove(
      bgioArguments,
      payload,
      context
    )

    const results = checkConditions(
      {
        ...bgioArguments,
        G: simulatedG
      },
      this.rule,
      simulatedPayload,
      context
    )

    return {
      results: results.results,
      conditionIsMet: results.conditionsAreMet
    }
  }
}
