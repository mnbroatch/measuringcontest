import cloneDeep from "lodash/cloneDeep.js";

// Things we always want, don't need to configure, and
// want to treat as first-class citizens
const invariantEntities = [
  { type: "Space" },
  {
    type: "Space",
    name: 'sharedBoard'
  }
]

function expandEntities (rules) {
  rules.entities = [
    ...invariantEntities,
    ...(rules.entities || [])
  ]
}

function expandInitialPlacements (rules) {
  if (rules.sharedBoard) {
    const sharedBoardPlacements = rules.sharedBoard.map(matcher => ({ entity: matcher, destination: { name: 'sharedBoard' } }))
    if (!rules.initialPlacements) rules.initialPlacements = []
    rules.initialPlacements.unshift(...sharedBoardPlacements)
  }

  if (rules.initialPlacements) {
    const initialPlacementMoves = rules.initialPlacements.map(placementMatchers => ({
      type: 'MoveEntity',
      arguments: {
        entity: {
          matches: placementMatchers.entity,
          automatic: true,
          location: 'bank'
        },
        destination: {
          matches: placementMatchers.destination,
          automatic: true
        },
      }
    }))
    if (!rules.initialMoves) rules.initialMoves = []
    rules.initialMoves.unshift(...initialPlacementMoves)
    delete rules.initialPlacements
  }
}

export default function expandGameRules (gameRules) {
  const rules = cloneDeep(gameRules)

  expandEntities(rules)
  expandInitialPlacements(rules)

  return rules
}
