import Move from "./move.js";
import resolveProperties from '../utils/resolve-properties.js'

export default class SetState extends Move {
  do(bgioArguments, { arguments: { entity } }, context) {
    entity.state = {
      ...entity.state,
      ...resolveProperties(bgioArguments, this.rule.state, context) 
    }
  }
}
