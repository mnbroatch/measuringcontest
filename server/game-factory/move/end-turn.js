import Move from "./move.js";

export default class EndTurn extends Move {
  do(bgioArguments) {
    console.log('123', 123)
    bgioArguments.events.endTurn()
  }
}
