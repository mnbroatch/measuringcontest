import SpaceGroupCondition from "../condition/space-group-condition.js";

export default class ContainsLine extends SpaceGroupCondition {
  checkForPattern(bgioArguments, space, target, matchesSoFar) {
    if (!this.checkSpace(bgioArguments, space)) {
      return { matches: [] };
    }

    const { length } = this.rule;
    const coordinates = target.getCoordinates(space.rule.index);
    const matches = [];
    const directions = ['right', 'downRight', 'down', 'downLeft'];

    for (let d = 0; d < directions.length; d++) {
      const direction = directions[d];
      const matchingSpaces = [space];

      // prevent overlapping lines in same direction
      if (matchesSoFar.some(match =>
        match.direction === direction && match.spaces.includes(space)
      )) {
        continue
      }

      // backward iteration disqualifies out-of-bounds instantly
      for (let i = length - 1; i >= 1; i--) {
        const newCoordinates = target.getNewCoordinatesInDirection(
          coordinates,
          direction,
          i
        );

        if (!newCoordinates) {
          break;
        }

        const newIndex = target.getIndex(newCoordinates);
        const newSpace = target.spaces[newIndex];

        if (this.checkSpace(bgioArguments, newSpace, matchingSpaces)) {
          matchingSpaces.splice(i, 0, newSpace);
          if (matchingSpaces.length === length) {
            matches.push({ direction, spaces: matchingSpaces });
          }
        } else {
          break;
        }
      }
    }

    return { matches };
  }
}
