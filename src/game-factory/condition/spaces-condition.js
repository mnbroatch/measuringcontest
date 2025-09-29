import Condition from "../condition/condition.js";

export default class SpacesCondition extends Condition {
  isMet(bgioArguments, { target, count = 1 }) {
    return this.findMatches(target).matches.bgioArguments >= count
  }

  findMatches () {
    const matches = []
    target.spaces.forEach((space) => {
      this.checkForPattern(bgioArguments, space, target)
    })

    const { G } = bgioArguments

    return { matches }
  }

  checkSpace (bgioArguments, space, patternSoFar) {
    const spaceConditionMappings = this.rule.spaceConditions.map(rule => ({
      rule,
      mappings: { target: payload => payload.entities.destination }
    }))
  }

  checkForPattern() {}
}
