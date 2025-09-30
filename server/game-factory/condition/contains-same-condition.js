import pick from "lodash/pick.js";
import conditionFactory from "./condition-factory.js";
import Condition from "./condition.js";

export default class ContainsSame extends Condition {
  checkCondition (bgioArguments, { targets }) {
    const [ first, ...restEntities ] = targets;
    const conditionIsMet = first.entities.some(entity => {
      const condition = conditionFactory({
        type: "Contains",
        entity: pick(entity, this.rule.properties)
      })
      return restEntities.every(ent => condition.isMet(bgioArguments, { target: ent }))
    })
    return { conditionIsMet }
  }
}
