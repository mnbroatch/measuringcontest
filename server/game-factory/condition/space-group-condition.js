import Condition from "./condition.js";
import conditionFactory from "./condition-factory.js";

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
  checkSpace (bgioArguments, space, patternSoFar = []) {
    const spaceMeetsConditions = this.rule.spaceConditions
      .every(rule =>
        conditionFactory(rule)
        .isMet(bgioArguments, { target: space })
      )
    if (spaceMeetsConditions && this.rule.spaceGroupConditions) {
      return this.rule.spaceGroupConditions
        .every(rule => conditionFactory(rule).isMet(
          bgioArguments,
          { targets: [ ...getRelevantSpaces(rule, space, patternSoFar) ] }
        ))
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
