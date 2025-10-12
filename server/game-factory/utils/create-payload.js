// this can't stay like this, needs to be based on rule, not moveName
export default function createPayload (moveName, targets) {
  switch (moveName) {
    case 'placePlayerMarker':
      return { arguments: { destination: targets[0] } }
    case 'placeDisc':
      return { arguments: { destination: targets[0] } }
  }
}

