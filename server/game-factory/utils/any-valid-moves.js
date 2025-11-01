import resolveProperties from "./resolve-properties.js";

export default function areThereValidMoves(bgioArguments, moves) {
  return Object.values(moves).some(move => {
    const { moveInstance } = move

    const args = resolveProperties(
      bgioArguments,
      moveInstance.rule.arguments,
      { moveInstance }
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
