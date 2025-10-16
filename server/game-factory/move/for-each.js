import Move from "./move.js";
import resolveArguments from '../utils/resolve-arguments.js'
import { getMoveInstance } from "./move-factory.js";

export default class ForEach extends Move {
  do(bgioArguments, { arguments: { targets } }, context) {
    console.log('targets', targets)
    targets.forEach((target) => {
      const loopItemArgNames = Object.keys(this.rule.move.arguments)
        .filter(a => this.rule.move.arguments[a] === 'LoopItem')
      const payload = { arguments: {} }
      loopItemArgNames.forEach(argName => { payload.arguments[argName] = target })
      const resolvedPayload = {
        arguments: resolveArguments(
          bgioArguments,
          this.rule.move,
          payload,
          context
        )
      }
      getMoveInstance(this.rule.move).doMove(
        bgioArguments,
        resolvedPayload,
        context
      )
    })
  }
}
