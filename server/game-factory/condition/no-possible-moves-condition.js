import Condition from "./condition.js";
import entityMatches from '../utils/entity-matches.js'
import areThereValidMoves from "../utils/any-valid-moves.js";
import getCurrentMoves from "../utils/get-current-moves.js";

export default class NoPossibleMoves extends Condition {
  checkCondition(bgioArguments, rule, _, context) {
    return {
      conditionIsMet: !areThereValidMoves(
        bgioArguments,
        getCurrentMoves(context.game, bgioArguments),
      )
    }
  }
}
