import Condition from "../condition/condition.js";

export default class IsEmptyCondition extends Condition {
  checkCondition(_, payload) {
    const { target } = payload
    if (!target) {
      return { conditionIsMet: false }
    } else {
      return { conditionIsMet: !target.entities.length }
    }
  }
}
