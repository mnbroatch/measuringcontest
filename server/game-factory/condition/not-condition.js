import Condition from "./condition.js";
import conditionFactory from "./condition-factory.js";

export default class NotCondition extends Condition {
  isMet(...args) {
    return !this.rule.conditions.every(conditionRule =>
      conditionFactory(conditionRule).isMet(...args)
    )
  }
}
