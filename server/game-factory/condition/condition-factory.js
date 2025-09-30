import NotCondition from "./not-condition.js";
import ContainsCondition from "./contains-condition.js";
import ContainsSameCondition from "./contains-same-condition.js";
import ContainsLine from "./contains-line-condition.js";
// import BingoCondition from "./bingo-condition.js";
// import SomeCondition from "./some-condition.js";
// import RelativeMoveCondition from "./relative-move-condition.js";

export default function conditionFactory(rule) {
  if (rule.type === "Contains") {
    return new ContainsCondition(rule);
  } else if (rule.type === "Not") {
    return new NotCondition(rule);
  } else if (rule.type === "ContainsSame") {
    return new ContainsSameCondition(rule);
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
