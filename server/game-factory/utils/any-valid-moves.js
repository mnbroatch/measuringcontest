import resolveArguments from "./resolve-arguments.js";

// will need to handle args that are dependent on others eventually
// probably also needs optimization for complex games
export default function areThereValidMoves(bgioArguments, moves) {
  return Object.values(moves).some(move => {
    const { moveInstance } = move

    // the magic is that resolveArguments will try to find
    // valid values for arguments. This could be incomplete...
    const payload = {
      arguments: resolveArguments(
        bgioArguments,
        moveInstance.rule,
        {},
        { moveInstance },
        true
      ) }
    const context = { moveInstance }
    return moveInstance.isValid(bgioArguments, payload, context)
  })
}
