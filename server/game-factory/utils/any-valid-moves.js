import resolveArguments from "./resolve-arguments.js";

// will need to handle args that are dependent on others eventually
// probably also needs optimization for complex games
export default function areThereValidMoves(bgioArguments, moves) {
  return Object.values(moves).some(move => {
    const { moveInstance } = move

    const args = resolveArguments(
      bgioArguments,
      moveInstance.rule,
      {},
      { moveInstance },
      true
    )

    if (Object.values(args).every(arg => arg !== undefined)) {
      const payload = { arguments: args }
      const context = { moveInstance }
      return moveInstance.isValid(bgioArguments, payload, context)
    } else {
      return false
    }
  })
}
