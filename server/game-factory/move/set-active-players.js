import Move from "./move.js";

export default class SetActivePlayers extends Move {
  do(bgioArguments, { arguments: { options } }) {
    bgioArguments.events.setActivePlayers(options)
  }
}
