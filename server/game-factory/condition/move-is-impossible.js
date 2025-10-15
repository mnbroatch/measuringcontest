import _matches from "lodash/matches.js";
import Condition from "../condition/condition.js";

export default class MoveIsImpossible extends Condition {
  checkCondition(bgioArguments, payload, context) {
    return { conditionIsMet: true }
  }
}
