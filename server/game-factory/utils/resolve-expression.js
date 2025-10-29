import { Parser } from 'expr-eval'
import resolveArguments from "../utils/resolve-arguments.js";

export default function resolveExpression (bgioArguments, rule, payload, context) {
  const args = resolveArguments(bgioArguments, rule, payload, context)
  return Parser.evaluate(rule.expression, args)
}
