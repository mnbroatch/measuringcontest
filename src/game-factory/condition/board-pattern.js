import SpacesCondition from "../condition/spaces-condition.js";

export default class BoardPattern extends SpacesCondition {
  isMet(bgioArguments, { target }) {
    // in a perfect world we would check for this sort of thing at game creation
    if (target.type !== 'Grid') {
      throw new Error ('BoardPattern only implemented for Grid')
    }

    const matches = []
    target.spaces.forEach((space) => {
      this.checkForPattern(bgioArguments, space, target)
    })

    const { G } = bgioArguments

    return !!matches.length && { matches }
  }

  checkForPattern () {}

  checkSpace (bgioArguments, space, lastSpace) {
    const spaceConditionMappings = rule.destination.conditions.map(rule => ({
      rule,
      mappings: { target: payload => payload.entities.destination }
    }))
    // return spaceConditionMappings.every(condition
  }
}
