import MoveEntity from "./move-entity.js";
// import Swap from "./swap.js";

export default function moveFactory(moveRule) {
  let move
  if (moveRule.type === "MoveEntity") {
    move = new MoveEntity(moveRule);
  // } else if (moveRule.type === "swap") {
  //   move = new Swap(moveRule);
  }
  return move.createBoardgameIOCompatibleMove()
}
