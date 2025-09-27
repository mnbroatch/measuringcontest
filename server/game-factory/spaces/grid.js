import chunk from "lodash/chunk.js";
import Spaces from "../spaces/spaces.js";

export default class Grid extends Spaces {
  getSpacesCount () {
    return this.rule.width * this.rule.height
  }

  getRows () {
    return chunk(this.spaces, this.rule.width)
  }
}
