import Condition from "./condition.js";
import checkConditions from '../utils/check-conditions.js'

export default class SpaceGroupCondition extends Condition {
  checkCondition(bgioArguments, { target }) {
    const count = this.rule.count || 1
    const matches = this.findMatches(bgioArguments, target).matches
    return { matches, conditionIsMet: matches.length >= count }
  }

  findMatches (bgioArguments, target) {
    const matches = []
    
    for (let i = 0; i < target.spaces.length; i++) {
      const space = target.spaces[i]
      matches.push(...this.checkForPattern(bgioArguments, space, target, matches).matches)
    }
    return { matches }
  }

  // patternSoFar is for checking dependent conditions like
  // "do these pieces all have the same player"
  checkSpace (bgioArguments, space, patternSoFar = [], context) {
    const spaceMeetsConditions = checkConditions(
      bgioArguments,
      { conditions: this.rule.spaceConditions },
      { target: space },
      context
    ).conditionsAreMet

    if (spaceMeetsConditions && this.rule.spaceGroupConditions) {
      return checkConditions(
        bgioArguments,
        { conditions: this.rule.spaceGroupConditions },
        { targets: [ ...getRelevantSpaces(this.rule, space, patternSoFar) ] },
        context
      ).conditionsAreMet
    } else {
      return spaceMeetsConditions
    }
  }

  checkForPattern(bgioArguments, space, target) {}
}

// performance optimization
function getRelevantSpaces (rule, space, patternSoFar) {
  const transitiveConditions = [ 'Same' ]
  return transitiveConditions.includes(rule.type)
    ? [...patternSoFar.slice(-1), space]
    : [...patternSoFar, space]
}
