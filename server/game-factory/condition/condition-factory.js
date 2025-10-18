import Is from "./is-condition.js";
import Not from "./not-condition.js";
import Some from "./some-condition.js";
import EverySpaceCondition from "./every-space-condition.js";
import ContainsCondition from "./contains-condition.js";
import ContainsSameCondition from "./contains-same-condition.js";
import ContainsLine from "./contains-line-condition.js";
import InLine from "./in-line-condition.js";
import Would from "./would-condition.js";
import MoveIsImpossible from "./move-is-impossible.js";
import Evaluate from "./evaluate-condition.js";
import Position from "./position-condition.js";
// import BingoCondition from "./bingo-condition.js";
// import SomeCondition from "./some-condition.js";
// import RelativeMoveCondition from "./relative-move-condition.js";

export default function conditionFactory(rule) {
  if (rule.type === "Is") {
    return new Is(rule);
  } else if (rule.type === "Not") {
    return new Not(rule);
  } else if (rule.type === "Some") {
    return new Some(rule);
  } else if (rule.type === "Contains") {
    return new ContainsCondition(rule);
  } else if (rule.type === "ContainsSame") {
    return new ContainsSameCondition(rule);
  } else if (rule.type === "EverySpace") {
    return new EverySpaceCondition(rule);
  } else if (rule.type === "InLine") {
    return new InLine(rule);
  } else if (rule.type === "Would") {
    return new Would(rule);
  } else if (rule.type === "MoveIsImpossible") {
    return new MoveIsImpossible(rule);
  } else if (rule.type === "Evaluate") {
    return new Evaluate(rule);
  } else if (rule.type === "Position") {
    return new Position(rule);
  // } else if (rule.type === "bingo") {
    // return new BingoCondition(rule);
  // } else if (rule.type === "some") {
    // return new SomeCondition(rule);
  // } else if (rule.type === "relativeMove") {
  //   return new RelativeMoveCondition(rule);
  } else if (rule.type === "ContainsLine") {
    return new ContainsLine(rule);
  }
}
