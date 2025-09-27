import PlaceEntity from "./place-entity.js";
// import MoveEntity from "./move-entity.js";
// import Swap from "./swap.js";

export default function moveFactory(moveRule) {
  let move
  if (moveRule.type === "PlaceEntity") {
    move = new PlaceEntity(moveRule);
  }
  // else if (moveRule.type === "moveEntity") {
  //   move = new MoveEntity(moveRule);
  // } else if (moveRule.type === "swap") {
  //   move = new Swap(moveRule);
  // }
  return move.createBoardgameIOCompatibleMove()
}
