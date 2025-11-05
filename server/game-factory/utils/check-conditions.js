import conditionFactory from '../condition/condition-factory.js';

export default function checkConditions (
  bgioArguments,
  rule,
  payload,
  context,
) {
  const { constraints = [], conditions = constraints } = rule
  const results = [];
  let failedAt
  for (const conditionRule of conditions) {

    const result = conditionFactory(conditionRule)
      .check(bgioArguments, payload, context);
    if (!result.conditionIsMet) {
      failedAt = conditionRule
    // if (rule.playerChoice) {
    //   console.log('------')
    //   console.log('payload', payload)
    //   console.log('rule', rule)
    //   console.log('failedAt', failedAt)
    // }

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
