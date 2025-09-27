import Condition from "./condition.js";
import conditionFactory from '../condition/condition-factory.js'

export default class SomeCondition extends Condition {
  isMet(actionPayload) {
    return this.rules.conditions.some((c) => conditionFactory(c, this.game).isMet(actionPayload));
  }
}
