import conditionFactory from '../condition/condition-factory.js';

export default function findMetCondition (
  bgioArguments,
  { conditions = [] },
  payload,
  context,
) {
  let success
  for (const conditionRule of conditions) {
    const result = conditionFactory(conditionRule)
      .check(bgioArguments, payload, context);
    if (result.conditionIsMet) {
      success = result
      break
    }
  }
  return success
}
