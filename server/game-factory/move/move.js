import { INVALID_MOVE } from 'boardgame.io/dist/cjs/core.js';
import checkConditions from "../utils/check-conditions.js";
import get from "../utils/get.js";

export default class Move {
  constructor (rule) {
    this.rule = rule

    this.conditionMappings = {
      move: {
        conditions: rule.conditions,
        getPayload: payload => payload
      },
      ...Object.entries(rule.arguments ?? {}).reduce((acc, [argName, argRule]) => ({
        ...acc,
        [argName]: {
          conditions: argRule.conditions,
          getPayload: payload => ({
            ...payload,
            target: payload.arguments[argName]
          })
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
    .reduce((acc, [groupName, { conditions, getPayload }]) => ({
      ...acc,
      [groupName]: checkConditions(
        bgioArguments,
        { conditions },
        getPayload(payload),
        context
      )
    }) , {})
  }

  resolveArguments (bgioArguments, payload, context) {
    return Object.entries(this.rule.arguments ?? {}).reduce((acc, [argName, argRule]) => {
      let argument = payload?.arguments?.[argName]
      if (!argument) {
        if (!argRule.automatic) {
          console.error(`non-automatic move rule didn't get argument: ${argName} in ${JSON.stringify(this.rule)}`)
        }
        if (argRule.location === 'bank') {
          argument = bgioArguments.G.bank.getOne(bgioArguments, argRule)
        } else if (argRule.contextPath) {
          console.log('context', context)
          argument = get(context, argRule.contextPath)
        } else {
          argument = bgioArguments.G.bank.findOne(bgioArguments, argRule, context)
        }
      }
      return {...acc, [argName]: argument}
    }, {})
  }


  doMove (bgioArguments, payload, context, skipCheck = false) {
    const resolvedPayload = {
      ...payload,
      arguments: this.resolveArguments(bgioArguments, payload, context)
    }

    let conditionResults
    if (!skipCheck) {
      conditionResults = this.checkConditionGroups(bgioArguments, resolvedPayload, context)
    }

    if (!skipCheck && !Object.values(conditionResults).every(r => r.conditionsAreMet)) {
      return INVALID_MOVE
    } else {
      this.do(bgioArguments, resolvedPayload)
    }

    return { conditionResults }
  }
}

