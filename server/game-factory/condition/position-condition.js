import Condition from "./condition.js";
import entityMatches from '../utils/entity-matches.js'

export default class Position extends Condition {
  checkCondition(bgioArguments, { target }) {
    const parent = bgioArguments.G.bank.findParent(target)
    let conditionIsMet
    if (this.rule.position === 'First') {
      conditionIsMet = parent.entities.indexOf(target) === 0
    }
    return { conditionIsMet }
  }
}
