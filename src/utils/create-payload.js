// not perfect; I think we'll want to switch to named arguments
const moveArgsMap = {
  PlaceNew: ['destination'],
  MoveEntity: ['entity', 'destination'],
  TakeFrom: ['source', 'destination'],
  SetState: ['entity', 'state'],
}

export default function createPayload (moveRule, targets) {
  return {
    arguments: targets.reduce((acc, target, i) => ({
      ...acc,
      [moveArgsMap[moveRule.type][i]]: target
    }), {})
  }
}

