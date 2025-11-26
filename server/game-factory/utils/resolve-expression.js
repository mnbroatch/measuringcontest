import { Parser } from 'expr-eval'
import resolveProperties from "../utils/resolve-properties.js";

const parser = new Parser();
parser.functions.sum = array => array.reduce((acc, val) => acc + val, 0)

export default function resolveExpression (bgioArguments, rule, context) {
  const args = resolveProperties(bgioArguments, rule.arguments, context)
  if (rule.expression === "(player == '0' and destinationCoordinates[1] == 0) or (player == '1' and destinationCoordinates[1] == 7)") {
  console.log('context', context)
  console.log('rule', rule)
  console.log('args', args)
  }
  return parser.evaluate(rule.expression, args)
}
