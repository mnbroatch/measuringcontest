import isPlainObject from "lodash/isPlainObject.js";
import resolveProperties from "./resolve-properties.js";

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
            [argName]: isPlainObject(arg) && argName !== 'state'
              ? bgioArguments.G.bank.find(bgioArguments, arg, context)
              : arg
          };
        }, {})
    }

    if (Object.values(resolvedPayload.arguments).every(arg => arg !== undefined)) {
      return moveInstance.isValid(bgioArguments, resolvedPayload, context)
    } else {
      return false
    }
  })
}
