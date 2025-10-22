// controls order of what players need to click first
const baseMoveArgsMap = {
  MoveEntity: ['entity', 'destination'],
  TakeFrom: ['source', 'destination'],
  SetState: ['entity', 'state'],
}

export default function getSteps (bgioState, moveRule, context) {
  return baseMoveArgsMap[moveRule.type]
    .filter(argName => moveRule.arguments[argName].playerChoice)
    .map(argName => ({
      argName,
      getClickable: argName === 'state'
        ? () => moveRule.arguments[argName].possibleValues.map((value) => ({
            abstract: true,
            ...moveRule.arguments[argName],
            value
          }))
        : () => bgioState.G.bank.findAll(
            bgioState,
            moveRule.arguments[argName],
            context
          )
    }))
}

