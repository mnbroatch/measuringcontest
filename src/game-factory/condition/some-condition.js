import Condition from "./condition.js";
import conditionFactory from '../condition/condition-factory.js'

export default class SomeCondition extends Condition {
  isConditionMet(bgioArguments, payload) {
    const conditionIsMet = this.rule.conditions.some((c) => conditionFactory(c).isMet(bgioArguments, payload));
    return { conditionIsMet }
  }
}
