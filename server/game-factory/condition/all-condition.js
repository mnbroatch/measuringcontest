import SpaceGroupCondition from "../condition/space-group-condition.js";

export default class All extends SpaceGroupCondition {
  checkForPattern(bgioArguments, space) {
    return this.checkSpace(bgioArguments, space)
      ? { matches: [space] }
      : { matches: [] };
  }
  checkCondition(bgioArguments, { target }) {
    const matches = this.findMatches(bgioArguments, target).matches
    return { matches, conditionIsMet: matches.length >= target.spaces.length }
  }
}
