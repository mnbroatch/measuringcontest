import Condition from "./condition.js";
import conditionFactory from "./condition-factory.js";

export default class SpaceGroupCondition extends Condition {
  checkCondition(bgioArguments, { target, count = 1 }) {
    console.log('arguments', arguments)
    const matches = this.findMatches(bgioArguments, target).matches
    return { matches, conditionIsMet: matches.length >= count }
  }

  findMatches (bgioArguments, target) {
    const matches = []
    target.spaces.forEach((space) => {
      this.checkForPattern(bgioArguments, space, target)
    })

    return { matches }
  }

  checkSpace (bgioArguments, space, patternSoFar) {
    const spaceMeetsConditions = this.rule.spaceConditions
      .every(rule =>
        conditionFactory(rule)
        .isMet(bgioArguments, { target: space })
      )
    if (spaceMeetsConditions && this.rule.spacesConditions) {
      return this.rule.spacesConditions
        .every(rule => {
          return conditionFactory(rule)
            .isMet(
              bgioArguments,
              { targets: [ ...getRelevantSpaces(rule, patternSoFar), space ] }
            )
        })
    } else {
      return spaceMeetsConditions
    }
  }

  checkForPattern() {}
}

// performance optimization
function getRelevantSpaces (rule, space, patternSoFar) {
  const transitiveConditions = [ 'Same' ]
  return transitiveConditions.includes(rule.type)
    ? [...patternSoFar.slice(-1), space]
    : [...patternSoFar, space]
}
