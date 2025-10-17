import Move from "./move.js";

export default class Shuffle extends Move {
  do(bgioArguments, { arguments: { target } }) {
    target.entities = bgioArguments.random.Shuffle(target.entities)
  }
}
