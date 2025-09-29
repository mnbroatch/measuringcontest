import DoesNotContainCondition from "./does-not-contain-condition.js";
// import ContainsCondition from "./contains-condition.js";
// import BingoCondition from "./bingo-condition.js";
// import BlackoutCondition from "./blackout-condition.js";
// import SomeCondition from "./some-condition.js";
// import RelativeMoveCondition from "./relative-move-condition.js";
// import ActionTypeMatchesCondition from "./action-type-matches-condition.js";
// import IsValidPlayerCondition from "./is-valid-player-condition.js";
import EntityMatchesCondition from "./entity-matches-condition.js";
import ContainsLine from "./contains-line.js";

export default function conditionFactory(rule) {
  // if (rule.type === "contains") {
  //   return new ContainsCondition(rule);
  // } else
  if (rule.type === "DoesNotContain") {
    return new DoesNotContainCondition(rule);
  // } else if (rule.type === "bingo") {
    // return new BingoCondition(rule);
  // } else if (rule.type === "blackout") {
    // return new BlackoutCondition(rule);
  // } else if (rule.type === "some") {
    // return new SomeCondition(rule);
  // } else if (rule.type === "relativeMove") {
  //   return new RelativeMoveCondition(rule);
  } else if (rule.type === "ContainsLine") {
    return new ContainsLine(rule);
  } else if (rule.type === "EntityMatches") {
    return new EntityMatchesCondition(rule);
  }
}
