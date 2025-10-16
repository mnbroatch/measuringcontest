import cloneDeep from "lodash/cloneDeep.js";

// for later when we implement deep replacement
// { type: 'IsEmpty' } = { type: 'not', conditions: [{ type: 'Contains' }], 
// { matcher: {...blah} } => conditions.push({type: "Is", matcher: {...blah} })

// Things we always want, don't need to configure, and
// want to treat as first-class citizens
const invariantEntities = [
  { type: "Space" },
  {
    type: "SharedBoard",
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
    const initialPlacementMoves = rules.initialPlacements.map(placementMatchers =>  {

    // put somewhere
    // const invariantConditionMappings = [
    //   {
    //     rule: {
    //       type: 'BankHasEnough',
    //       entity: rule.entity
    //     }
    //   },
    // ]


      // probably going to need to separate this even in the shorthand. maybe
      // combine, then search entity rule and extract state variables instead?
      const { state, ...matcher } = placementMatchers.entity
      return {
        type: 'MoveEntity',
        arguments: {
          entity: {
            automatic: true,
            location: 'Bank',
            matcher,
            state
          },
          destination: {
            automatic: true,
            conditions: [{
              type: 'Is',
              matcher: placementMatchers.destination
            }]
          },
        }
      }
    })
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
