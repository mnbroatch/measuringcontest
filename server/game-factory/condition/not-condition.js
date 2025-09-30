import Condition from "./condition.js";
import conditionFactory from "./condition-factory.js";

export default class NotCondition extends Condition {
  checkCondition(...args) {
    const conditionIsMet = !this.rule.conditions.every(conditionRule => conditionFactory(conditionRule).isMet(...args))
    return { conditionIsMet }
  }
}
