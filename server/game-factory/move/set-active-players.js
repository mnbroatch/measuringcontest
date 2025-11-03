import Move from "./move.js";

export default class SetActivePlayers extends Move {
  do(bgioArguments, rule) {
    bgioArguments.events.setActivePlayers(rule.options)
  }
}
