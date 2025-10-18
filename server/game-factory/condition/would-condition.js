import Condition from "./condition.js";
import checkConditions from "../utils/check-conditions.js";
import createPayload from "../utils/create-payload.js";
import simulateMove from "../utils/simulate-move.js";

export default class WouldCondition extends Condition {
  checkCondition(bgioArguments, { target, targets }, context) {
    const payload = createPayload(
      bgioArguments,
      context.moveInstance.rule,
      targets ?? [target],
      context
    )

    const simulatedG = simulateMove(
      bgioArguments,
      payload,
      context
    )

    let simulatedConditionsPayload = {}
    if (target) {
      simulatedConditionsPayload = {
        target: simulatedG.bank.locate(target.entityId)
      }
    } else if (targets) {
      simulatedConditionsPayload = {
        targets: targets.map(t => simulatedG.bank.locate(t.entityId))
      }
    }

    const conditionResults = checkConditions(
      {
        ...bgioArguments,
        G: simulatedG
      },
      this.rule,
      simulatedConditionsPayload,
      context
    )

    const conditionIsMet = conditionResults.conditionsAreMet

    // optimization: don't bother restoring on failure
    const results = conditionIsMet
      ? restoreReferences(
        conditionResults.results,
        entityId => bgioArguments.G.bank.locate(entityId)
      )
      : conditionResults.results

    return {
      results,
      conditionIsMet
    }
  }
}

function restoreReferences(obj, getOriginalEntity, seen = new WeakSet()) {
  // Handle primitives and null
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  // Prevent infinite loops on circular references
  if (seen.has(obj)) {
    return obj;
  }
  seen.add(obj);
  
  // If this object has an entityId, replace it entirely
  if (obj.entityId !== undefined) {
    return getOriginalEntity(obj.entityId);
  }
  
  // Otherwise, recursively process its properties
  if (Array.isArray(obj)) {
    return obj.map(item => restoreReferences(item, getOriginalEntity, seen));
  } else {
    const restored = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        restored[key] = restoreReferences(obj[key], getOriginalEntity, seen);
      }
    }
    return restored;
  }
}
