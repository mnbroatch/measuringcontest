import checkConditions from "./check-conditions.js";
import resolveProperties from './resolve-properties.js'

// todo: can we generically loop through properties instead of winner specifics?
export default function getScenarioResults(bgioArguments, scenarios) {
  let match
  for (const scenario of scenarios) {
    const conditionResults = checkConditions(bgioArguments, scenario)
    if (conditionResults.conditionsAreMet) {
      match = { scenario, conditionResults }
      break
    }
  }

  if (match) {
    const resultRule = match.scenario.result
    if (resultRule.winner) {
      return {
        winner: resolveProperties(
          bgioArguments,
          resultRule.winner,
          { results: match.conditionResults.results }
        )
      }
    } else if (resultRule.winners) {
      return {
        winners: resolveProperties(
          bgioArguments,
          resultRule.winners,
          { results: match.conditionResults.results }
        )
      }
    } else {
      return resultRule
    }
  }


  return null;
}
