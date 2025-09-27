import matches from "lodash/matches.js";
import Condition from "../condition/condition.js";

export default class EntityMatchesCondition extends Condition {
  isMet(payload) {
    const { entity } = this.resolveMappings(payload);

    if (!entity) {
      console.error("no entity found");
      return false;
    }

    return matches(this.rule)(entity);
  }
}
