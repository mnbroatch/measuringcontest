import Condition from "./condition.js";
import conditionFactory from "./condition-factory.js";

export default class NotCondition extends Condition {
  checkCondition(...args) {
    const conditionIsMet = !this.rule.conditions.every(conditionRule => {
      const x = conditionFactory(conditionRule).isMet(...args)
      console.log('x', x)
    })
    return { conditionIsMet }
  }
}
