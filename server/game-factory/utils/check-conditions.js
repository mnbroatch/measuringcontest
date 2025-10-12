import conditionFactory from '../condition/condition-factory.js';

export default function (bgioArguments, { conditions = [] }, payload, context) {
  const results = [];
  let failedAt
  
  for (const conditionRule of conditions) {
    const result = conditionFactory(conditionRule).isMet(bgioArguments, payload, context);
    
    if (!result.conditionIsMet) {
      failedAt = conditionRule
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
