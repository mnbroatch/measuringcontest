import getSteps from "./get-steps.js";

export default function createPayload (bgioState, moveRule, targets, context) {
  const moveSteps = getSteps(
    bgioState,
    moveRule,
    context
  )
  const moveArguments = moveSteps.reduce((acc, step, i) => ({
    ...acc,
    [step.argName]: targets[i]
  }), {})
  return { arguments: moveArguments }
}

