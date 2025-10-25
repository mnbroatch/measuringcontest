import _matches from "lodash/matches.js";
import Condition from "../condition/condition.js";
import { Parser } from 'expr-eval'
import resolveArguments from "../utils/resolve-arguments.js";


export default class Evaluate extends Condition {
  checkCondition(bgioArguments, payload, context) {
    const args = resolveArguments(bgioArguments, this.rule, payload, context)
    return { conditionIsMet: Parser.evaluate(this.rule.expression, args) }
  }
}
