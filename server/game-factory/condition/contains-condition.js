import _matches from "lodash/matches.js";
import Condition from "../condition/condition.js";
import checkConditions from "../utils/check-conditions.js";

export default class ContainsCondition extends Condition {
  checkCondition(bgioArguments, payload, context) {
    const { target } = payload
    if (!target) {
      return { matches: [], conditionIsMet: false }
    } else {
      const matches = target.entities.filter(entity => checkConditions(bgioArguments, this.rule, { target: entity }, context).conditionsAreMet)
      return { matches, conditionIsMet: !!matches.length }
    }
  }
}
