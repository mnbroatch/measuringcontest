import SpacesCondition from "../condition/spaces-condition.js";

export default class ContainsLine extends SpacesCondition {
  checkForPattern (bgioArguments, space, target) {
    if (!this.checkSpace(bgioArguments, space)) {
      return false
    }
    const { length } = this.rule
    const coordinates = this.getCoordinates(space.rule.index)
    const matches = [];
    [
      'right',
      'downRight',
      'down',
      'downLeft',
    ].forEach((direction) => {
      const matchingSpaces = [space]
      return new Array(length - 1).fill().every((_, i) => {
        const newCoordinates = target.getNewCoordinatesInDirection(
          coordinates,
          direction,
          i + 1
        )
        if (!newCoordinates) return false
        const newIndex = target.getIndex(newCoordinates)
        const newSpace = target.spaces[newIndex]
        if (this.checkSpace(bgioArguments, newSpace, matchingSpaces)) {
          matchingSpaces.push(newSpace)
          if (matchingSpaces.length === length) {
            matches.push(matchingSpaces)
          }
          return true
        }
      })
    })

    return !!matches.length && { matches }
  }
}
