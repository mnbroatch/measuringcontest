import resolveProperties from "./resolve-properties.js";

export default function resolveArguments (
  bgioArguments,
  moveRule,
  payload,
  context
) {
  return Object.entries(moveRule.arguments ?? {})
    .reduce((acc, [argName, argRule]) => {
      return {
        ...acc,
        [argName]: payload?.arguments?.[argName]
          ?? resolveProperties(bgioArguments, argRule, context)
      }
    }, {})
}
