import { INVALID_MOVE } from 'boardgame.io/dist/cjs/core.js';
import checkConditions from "../utils/check-conditions.js";
import resolveProperties from "../utils/resolve-properties.js";
import resolveEntity from "../utils/resolve-entity.js";

export default class Move {
  constructor (rule) {
    this.rule = rule

    console.log('rule', rule)
    this.conditionMappings = {
      move: {
        conditions: rule.conditions,
        getPayload: payload => payload
      },
      ...Object.entries(rule.arguments ?? {}).reduce((acc, [argName, argRule]) => ({
        ...acc,
        [argName]: {
          conditions: argRule.constraints,
          getPayload: payload => {
            return ({
              ...payload,
              target: payload.arguments[argName]
            })
          }
        }
      }), {})
    }
  }

  isValid (bgioArguments, payload, context) {
    const conditionResults = this.checkConditionGroups(
      bgioArguments,
      payload,
      context
    )
    return Object.values(conditionResults).every(r => r.conditionsAreMet)
  }

  checkConditionGroups (bgioArguments, payload, context) {
    return Object.entries(this.conditionMappings)
      .reduce((acc, [groupName, { conditions, getPayload }]) => {
        if (this.rule.arguments?.[groupName]?.matchMultiple) {
          if (!payload.arguments[groupName].length) {
            return { conditionsAreMet: false }
          }

          // this is slightly wrong if an argument has "moves" as name, say.
          // More obviously, we only keep last results. Will the issue matter
          // where we use conditionResults (endIf, for instance)?
          let results
          let i = 0
          do {
            results = checkConditions(
              bgioArguments,
              { conditions },
              getPayload({
                arguments: {
                  [groupName]: payload.arguments[groupName][i]
                }
              }),
              context
            )
            i++
          } while (i < payload.arguments[groupName].length && results.conditionsAreMet)
          return ({
            ...acc,
            [groupName]: results
          })
        } else {
          return ({
            ...acc,
            [groupName]: checkConditions(
              bgioArguments,
              { conditions },
              getPayload(payload),
              context
            )
          })
        }
      } , {})
  }

  doMove (bgioArguments, payload, context, skipCheck = false) {
    const rule = resolveProperties(
      bgioArguments,
      this.rule,
      context
    )
    const resolvedPayload = {
      ...payload,
      arguments: Object.entries(rule.arguments ?? {})
        .reduce((acc, [argName, arg]) => {
          return {
            ...acc,
            [argName]: payload?.arguments?.[argName]
              ?? resolveEntity(
                bgioArguments,
                arg,
                context,
                argName
              )
          };
        }, {})
    };

    let conditionResults
    if (!skipCheck) {
      conditionResults = this.checkConditionGroups(bgioArguments, resolvedPayload, context)
    }

    if (!skipCheck && !Object.values(conditionResults).every(r => r.conditionsAreMet)) {
      return INVALID_MOVE
    } else {
      this.do(bgioArguments, rule, resolvedPayload, context)
      if (context) {
        context.previousArguments = resolvedPayload.arguments
      }
    }

    return { conditionResults }
  }
}
