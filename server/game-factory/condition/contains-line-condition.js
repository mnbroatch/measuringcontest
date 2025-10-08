import SpaceGroupCondition from "../condition/space-group-condition.js";

// right, downRight, down, downLeft
const relativeCoordinates = [[1, 0], [1, 1], [0, 1], [-1, 1]];

export default class ContainsLine extends SpaceGroupCondition {
  checkForPattern(bgioArguments, space, target, matchesSoFar) {
    if (!this.checkSpace(bgioArguments, space)) {
      return { matches: [] };
    }

    const { length } = this.rule;
    const coordinates = target.getCoordinates(space.rule.index);
    const matches = [];

    for (let d = 0; d < relativeCoordinates.length; d++) {
      const relativeCoordinate = relativeCoordinates[d];
      const matchingSpaces = [space];

      // prevent overlapping lines in same relativeCoordinate
      if (matchesSoFar.some(match =>
        match.relativeCoordinate === relativeCoordinate && match.spaces.includes(space)
      )) {
        continue
      }

      // backward iteration disqualifies out-of-bounds instantly
      for (let d = length - 1; d >= 1; d--) {
        const newCoordinates = target.getRelativeCoordinates(
          coordinates,
          [relativeCoordinate[0] * d, relativeCoordinate[0] * d]
        );

        if (!newCoordinates) {
          break;
        }

        const newIndex = target.getIndex(newCoordinates);
        const newSpace = target.spaces[newIndex];

        if (this.checkSpace(bgioArguments, newSpace, matchingSpaces)) {
          // insert at right place between pre-checked d=0 and d=farthest
          matchingSpaces.splice(d, 0, newSpace);
          if (matchingSpaces.length === length) {
            matches.push({ relativeCoordinate, spaces: matchingSpaces });
          }
        } else {
          break;
        }
      }
    }

    return { matches };
  }
}
