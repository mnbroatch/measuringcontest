import { serialize, deserialize } from 'wackson'
import { registry } from '../registry.js'
import createPayload from "../utils/create-payload.js";

export default function simulateMove (bgioArguments, payload, context) {
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

  context.moveInstance.doMove(
    newBgioArguments,
    createPayload(
      context.moveInstance.rule.type,
      simulatedPayload.targets ?? [simulatedPayload.target]
    ),
    context,
    true
  )

  return {
    simulatedG,
    simulatedPayload
  }
}
