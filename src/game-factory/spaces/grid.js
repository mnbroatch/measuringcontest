import chunk from "lodash/chunk";
import Spaces from "../spaces/spaces.js";

export default class Grid extends Spaces {
  constructor(rule) {
    super(rule);
    this.width = boardRule.width
    this.height = boardRule.height
  }

  getSpacesCount () {
    return this.width * this.height
  }

  getRows () {
    return chunk(this.spaces, this.width)
  }
}
