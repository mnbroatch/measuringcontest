import Condition from "./condition.js";
import checkConditions from "../utils/check-conditions.js";

export default class WouldCondition extends Condition {
  checkCondition(bgioArguments, payload, context) {
    const originalGState = {
      ...bgioArguments,
      G: bgioArguments.originalG
    }

    const pureMove = context.move.moveInstance.createBoardgameIOCompatibleMove()
    const gAfterMove = pureMove(originalGState, preparePayload(movePayload))
    const newBgioArguments = {
      ...bgioArguments,
      G: gAfterMove,
    }

    const conditionIsMet = checkConditions(bgioArguments, this.rule, payload, context).conditionsAreMet
    return { conditionIsMet }
  }
}
