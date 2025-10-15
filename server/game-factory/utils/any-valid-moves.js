import moveFactory from "../move/move-factory.js";
import resolveArguments from "./resolve-arguments.js";

// will need to handle args that are dependent on others eventually
// probably also needs optimization for complex games
export default function areThereValidMoves(bgioArguments, moveRules) {
  return moveRules.some(moveRule => {
    const move = moveFactory({ moveRule }).moveInstance;
    const payload = { arguments: resolveArguments(bgioArguments, moveRule) }
    const context = { moveInstance: move }
    return move.isValid(bgioArguments, payload, context)
  })
}
