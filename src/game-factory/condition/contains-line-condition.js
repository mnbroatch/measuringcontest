import SpaceGroupCondition from "../condition/space-group-condition.js";

export default class ContainsLine extends SpaceGroupCondition {
  checkForPattern(bgioArguments, space, target) {
    let result = false;

    if (!this.checkSpace(bgioArguments, space)) {
      return false;
    }

    const { length } = this.rule;
    const coordinates = target.getCoordinates(space.rule.index);
    const matches = [];
    const directions = ['right', 'downRight', 'down', 'downLeft'];

    for (let d = 0; d < directions.length; d++) {
      const direction = directions[d];
      const matchingSpaces = [space];

      // backward iteration: furthest step first
      for (let step = length - 1; step >= 1; step--) {
        const newCoordinates = target.getNewCoordinatesInDirection(
          coordinates,
          direction,
          step
        );

        if (!newCoordinates) {
          break; // no space in this direction
        }

        const newIndex = target.getIndex(newCoordinates);
        const newSpace = target.spaces[newIndex];

        if (this.checkSpace(bgioArguments, newSpace, matchingSpaces)) {
          matchingSpaces.push(newSpace);
          if (matchingSpaces.length === length) {
            matches.push(matchingSpaces);
          }
        } else {
          break; // stop extending in this direction
        }
      }
    }

    if (matches.length > 0) {
      result = { matches };
    }

    return result;
  }
}
