import resolveProperties from "./resolve-properties.js";
import resolveEntity from "./resolve-entity.js";

export default function areThereValidMoves(bgioArguments, moves) {
  return Object.values(moves).some(move => {
    const { moveInstance } = move

    const context = { moveInstance }

    const rule = resolveProperties(
      bgioArguments,
      moveInstance.rule,
      context
    )

    // todo: This is incomplete. it is only concerned with the
    // validity of one argument at a time and the combination
    // of individually valid choices can be invalid. One option
    // (maybe the only one) is to try all combinations of valid arguments.
    const resolvedPayload = {
      arguments: Object.entries(rule.arguments ?? {})
        .reduce((acc, [argName, arg]) => {
          return {
            ...acc,
            [argName]: resolveEntity(
              bgioArguments,
              arg,
              context,
              argName 
            )
          }
        }, {})
    }

    if (Object.values(resolvedPayload.arguments).every(arg => arg !== undefined)) {
      return moveInstance.isValid(bgioArguments, resolvedPayload, context)
    } else {
      return false
    }
  })
}
