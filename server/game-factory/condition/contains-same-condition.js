import pick from "lodash/pick.js";
import conditionFactory from "./condition-factory.js";
import Condition from "./condition.js";

export default class ContainsSame extends Condition {
  checkCondition (bgioArguments, { targets }) {
    if (targets.length === 1) {
      return { conditionIsMet: true }
    }

    const [ first, ...restEntities ] = targets;
    const conditionIsMet = first.entities.some(entity => {
      const condition = conditionFactory({
        type: "Contains",
        conditions: [{
          type: 'Is',
          matcher: pick(entity.rule, this.rule.properties)
        }]
      })
      return restEntities.every(ent => {
        return condition.isMet(bgioArguments, { target: ent })
      })
    })
    return { conditionIsMet }
  }
}
