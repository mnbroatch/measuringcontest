import Move from "./move.js";
import createPayload from '../utils/create-payload.js'
import { getMoveInstance } from "./move-factory.js";

export default class ForEach extends Move {
  do(bgioArguments, { arguments: { targets } }, context) {
    targets.forEach((target) => {
      getMoveInstance(this.rule.move).doMove(
        bgioArguments,
        createPayload(this.rule.move.type, [target]),
        context
      )
    })
  }
}
