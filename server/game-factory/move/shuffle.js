import Move from "./move.js";

export default class Shuffle extends Move {
  do(bgioArguments, { arguments: { target } }) {
    // is this in-place?
    bgioArguments.random.shuffle(bgioArguments, target.entities)
  }
}
