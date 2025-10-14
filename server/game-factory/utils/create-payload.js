// this can't stay like this
export default function createPayload (moveType, targets) {
  switch (moveType) {
    case 'MoveEntity':
      return { arguments: { destination: targets[0] } }
    case 'SetState':
      return { arguments: { entity: targets[0] } }
    case 'ForEach':
      return { arguments: { targets } }
  }
}

