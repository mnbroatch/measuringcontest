// controls order of what players need to click first
const baseMoveArgsMap = {
  MoveEntity: ['entity', 'destination'],
  SetState: ['entity', 'state'],
}

// we should probably only be making current step targets clickable...
// probably will be obvious once we have multi-step moves in practice
export default function getSteps (bgioState, moveRule, context) {
  return baseMoveArgsMap[moveRule.type]
    .filter(argName => moveRule.arguments[argName].playerChoice)
    .map(argName => ({
      argName,
      getClickable: () => bgioState.G.bank.findAll(
        bgioState,
        moveRule.arguments[argName],
        context
      )
    }))
}

