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

    const resolvedPayload = {
      arguments: Object.entries(rule.arguments ?? {})
        .reduce((acc, [argName, arg]) => {
          return {
            ...acc,
            [argName]: argName !== 'state' && resolveEntity(
              bgioArguments,
              arg,
              context
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
