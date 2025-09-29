import chunk from "lodash/chunk.js";
import Spaces from "../spaces/spaces.js";
import { areCredentialsAuthentic } from "boardgame.io/dist/types/src/server/auth.js";

export default class Grid extends Spaces {
  getSpacesCount () {
    return this.rule.width * this.rule.height
  }

  getRows () {
    return chunk(this.spaces, this.rule.width)
  }

  getCoordinates (index) {
    const { width } = this.rule
    return [
      index % width,
      Math.floor(index/width)
    ]
  }

  getIndex ([ x, y ]) {
    const { width } = this.rule
    return y * width + x
  }

  getNewCoordinatesInDirection ([x, y], direction, distance = 1) {
    const newCoordinates = {
      up: () => [x, y - distance],
      upRight: () => [x + distance, y - distance],
      right: () => [x + distance, y],
      downRight: () => [x + distance, y + distance],
      down: () => [x, y + distance],
      downLeft: () => [x - distance, y + distance],
      left: () => [x - distance, y],
      upLeft: () => [x - distance, y - distance],
    }[direction]()
    return this.areCoordinatesValid(newCoordinates)
      ? newCoordinates
      : null
  }

  areCoordinatesValid([x, y]) {
    return x >= 0 
      && y >= 0 
      && x < this.rule.width
      && y < this.rule.height
  }
}
