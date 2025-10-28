import Move from "./move.js";
import resolveArguments from '../utils/resolve-arguments.js'
import { getMoveInstance } from "./move-factory.js";

export default class ForEach extends Move {
  do(bgioArguments, { arguments: { targets } }, context) {
    targets.forEach((target) => {
      const loopContext = {
        ...context,
        loopTarget: target
      }
      const payload = { arguments: {} }
      const resolvedPayload = {
        arguments: resolveArguments(
          bgioArguments,
          this.rule.move,
          payload,
          loopContext
        )
      }
      console.log('resolvedPayload', resolvedPayload)
      getMoveInstance(this.rule.move).doMove(
        bgioArguments,
        resolvedPayload,
        loopContext
      )
    })
  }
}
