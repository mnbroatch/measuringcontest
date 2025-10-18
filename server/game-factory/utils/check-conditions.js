import conditionFactory from '../condition/condition-factory.js';

export default function checkConditions (
  bgioArguments,
  { conditions = [] },
  payload,
  context,
  escapeOnSuccess
) {
  const results = [];
  let failedAt
  
  for (const conditionRule of conditions) {
    const result = conditionFactory(conditionRule).check(bgioArguments, payload, context);
    
    if (!result.conditionIsMet && !escapeOnSuccess) {
      failedAt = conditionRule
      break
    } else if (result.conditionIsMet && escapeOnSuccess) {
      results.push(result);
      break
    } else {
      results.push(result);
    }
  }

  return {
    results,
    failedAt,
    conditionsAreMet: results.length === conditions.length
  };
}
