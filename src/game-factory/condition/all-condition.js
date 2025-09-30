import SpaceGroupCondition from "../condition/space-group-condition.js";

export default class All extends SpaceGroupCondition {
  checkForPattern(bgioArguments, space) {
    return this.checkSpace(bgioArguments, space)
      ? { matches: [space] }
      : { matches: [] };
  }
  isMet(bgioArguments, { target }) {
    console.log('this.check(...args).matches', this.check(...args).matches)
    return this.check(...args).matches.length === target.spaces.length
  }
}
