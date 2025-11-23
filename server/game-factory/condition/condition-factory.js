import Is from "./is-condition.js";
import Not from "./not-condition.js";
import Or from "./or-condition.js";
import Some from "./some-condition.js";
import Every from "./every-condition.js";
import ContainsCondition from "./contains-condition.js";
import ContainsSameCondition from "./contains-same-condition.js";
import InLine from "./in-line-condition.js";
import Would from "./would-condition.js";
import NoPossibleMoves from "./no-possible-moves-condition.js";
import Evaluate from "./evaluate-condition.js";
import Position from "./position-condition.js";
// import BingoCondition from "./bingo-condition.js";
// import RelativeMoveCondition from "./relative-move-condition.js";

export default function conditionFactory(rule) {
  if (rule.type === "Is") {
    return new Is(rule);
  } else if (rule.type === "Not") {
    return new Not(rule);
  } else if (rule.type === "Or") {
    return new Or(rule);
  } else if (rule.type === "Some") {
    return new Some(rule);
  } else if (rule.type === "Contains") {
    return new ContainsCondition(rule);
  } else if (rule.type === "ContainsSame") {
    return new ContainsSameCondition(rule);
  } else if (rule.type === "Every") {
    return new Every(rule);
  } else if (rule.type === "InLine") {
    return new InLine(rule);
  } else if (rule.type === "Would") {
    return new Would(rule);
  } else if (rule.type === "NoPossibleMoves") {
    return new NoPossibleMoves(rule);
  } else if (rule.type === "Evaluate") {
    return new Evaluate(rule);
  } else if (rule.type === "Position") {
    return new Position(rule);
  // } else if (rule.type === "bingo") {
    // return new BingoCondition(rule);
  // } else if (rule.type === "relativeMove") {
  //   return new RelativeMoveCondition(rule);
  }
}
