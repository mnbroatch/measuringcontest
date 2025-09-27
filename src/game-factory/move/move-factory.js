import PlaceEntity from "./place-entity.js";
// import MovePiece from "./move-piece.js";
// import Swap from "./swap.js";

export default function moveFactory(moveRule) {
  let move
  if (moveRule.type === "placeEntity") {
    move = new PlaceEntity(moveRule);
  }
  // else if (moveRule.type === "moveEntity") {
  //   move = new MoveEntity(moveRule);
  // } else if (moveRule.type === "swap") {
  //   move = new Swap(moveRule);
  // }
  return move.createBoardgameIOCompatibleMove()
}
