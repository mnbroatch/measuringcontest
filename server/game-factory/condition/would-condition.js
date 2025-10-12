import { serialize, deserialize } from 'wackson'
import { registry } from '../registry.js'
import Condition from "./condition.js";
import checkConditions from "../utils/check-conditions.js";
import createPayload from "../utils/create-payload.js";

export default class WouldCondition extends Condition {
  checkCondition(bgioArguments, payload, context) {
    const simulatedG = deserialize(serialize(bgioArguments.G), registry)
    const newBgioArguments = {
      ...bgioArguments,
      G: simulatedG,
    }
    const simulatedPayload = { ...payload }
    if (payload.target) {
      simulatedPayload.target = simulatedG.bank.locate(payload.target.entityId)
    }
    if (payload.targets) {
      simulatedPayload.targets = payload.targets.map(t => simulatedG.bank.locate(t.entityId))
    }
    context.move.doMove(
      newBgioArguments,
      createPayload(
        context.move.rule.name,
        simulatedPayload.targets ?? [simulatedPayload.target]
      ),
      context,
      true
    )

    return {
      conditionIsMet: checkConditions(
        newBgioArguments,
        this.rule,
        simulatedPayload,
        context
      ).conditionsAreMet
    }
  }
}
