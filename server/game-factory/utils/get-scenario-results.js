import checkConditions from "./check-conditions.js";
import resolveProperties from './resolve-properties.js'

export default function getScenarioResults(bgioArguments, scenarios, context) {
  let match
  for (const scenario of scenarios) {
    const conditionResults = checkConditions(bgioArguments, scenario)
    if (conditionResults.conditionsAreMet) {
      match = { scenario, conditionResults }
      break
    }
  }

  if (match?.scenario?.result) {
    console.log('match.scenario.result', match.scenario.result)
    console.log('match.conditionResults.results ', match.conditionResults.results )
    const x = resolveProperties(
      bgioArguments,
      match.scenario.result,
      { results: match.conditionResults.results }
    )
    console.log('x', x)
    return x
  } else {
    return match
  }
}
