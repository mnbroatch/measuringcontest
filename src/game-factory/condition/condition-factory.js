import DoesNotContainCondition from "./does-not-contain-condition.js";
// import ContainsCondition from "./contains-condition.js";
// import BingoCondition from "./bingo-condition.js";
// import BlackoutCondition from "./blackout-condition.js";
// import SomeCondition from "./some-condition.js";
// import RelativeMoveCondition from "./relative-move-condition.js";
// import ActionTypeMatchesCondition from "./action-type-matches-condition.js";
// import IsValidPlayerCondition from "./is-valid-player-condition.js";
import EntityMatchesCondition from "./entity-matches-condition.js";

export default function conditionFactory({ rule, mappings }) {
  // if (rule.type === "contains") {
  //   return new ContainsCondition(rule, mappings);
  // } else
  if (rule.type === "DoesNotContain") {
    return new DoesNotContainCondition(rule, mappings);
  // } else if (rule.type === "bingo") {
    // return new BingoCondition(rule, mappings);
  // } else if (rule.type === "blackout") {
    // return new BlackoutCondition(rule, mappings);
  // } else if (rule.type === "some") {
    // return new SomeCondition(rule, mappings);
  // } else if (rule.type === "relativeMove") {
  //   return new RelativeMoveCondition(rule, mappings);
  } else if (rule.type === "EntityMatches") {
    return new EntityMatchesCondition(rule, mappings);
  }
}
