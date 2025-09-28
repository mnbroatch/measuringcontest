import BoardPattern from "../condition/board-pattern.js";

export default class Line extends BoardPattern {
  checkForPattern (bgioArguments, space, target) {
    let total = 0
    let currentSpace = space
    while (this.checkSpace(bgioArguments, currentSpace) &&  ) {
      total++
    }
  }
}
