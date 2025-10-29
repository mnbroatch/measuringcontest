import { Parser } from 'expr-eval'
import resolveArguments from "../utils/resolve-arguments.js";

const parser = new Parser();
parser.functions.sum = array => array.reduce((acc, val) => acc + val, 0)

export default function resolveExpression (bgioArguments, rule, payload, context) {
  const args = resolveArguments(bgioArguments, rule, payload, context)
  return parser.evaluate(rule.expression, args)
}
