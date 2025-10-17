import cloneDeep from "lodash/cloneDeep.js";
import find from "lodash/find.js";

// for later when we implement deep replacement
// { type: 'IsEmpty' } = { type: 'not', conditions: [{ type: 'Contains' }], 
// { matcher: {...blah} } => conditions.push({type: "Is", matcher: {...blah} })

    // put somewhere
    // const invariantConditionMappings = [
    //   {
    //     rule: {
    //       type: 'BankHasEnough',
    //       entity: rule.entity
    //     }
    //   },
    // ]


// Things we always want, don't need to configure, and
// want to treat as first-class citizens
const invariantEntities = [
  {
    type: "Space",
    count: "Infinity",
  },
  {
    type: "Board",
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

  if (rules.personalBoard) {
    rules.entities.push({
      type: "Board",
      name: 'personalBoard',
      perPlayer: true
    })
    const personalBoardPlacements = rules.personalBoard.map(matcher => ({
      entity: matcher,
      destination: {
        name: 'personalBoard'
      }
    }))
    if (!rules.initialPlacements) rules.initialPlacements = []
    rules.initialPlacements.unshift(...personalBoardPlacements)
  }

  if (rules.initialPlacements) {
    const initialPlacementMoves = rules.initialPlacements.map(placement =>  {

      // probably going to need to separate this even in the shorthand. maybe
      // combine, then search entity rule and extract state variables instead?
      const { state, ...matcher } = placement.entity
      const entityDefinition = find(rules.entities, matcher)
      
      if (placement.destination.name === 'personalBoard') {
        return {
          type: 'ForEach',
          arguments: {
            targets: { ctxPath: ['playOrder'] }
          },
          move: {
            type: 'MoveEntity',
            arguments: {
              entity: {
                automatic: true,
                location: 'Bank',
                matcher: {
                  ...matcher,
                  ...(entityDefinition.perPlayer
                      ? { player: { contextPath: ['loopTarget'] } }
                      : {}
                  )
                },
                state
              },
              destination: {
                automatic: true,
                conditions: [{
                  type: 'Is',
                  matcher: {
                    ...placement.destination,
                    player: { contextPath: ['loopTarget'] }
                  }
                }]
              },
            }
          }
        }
      } else {
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
                matcher: placement.destination
              }]
            },
          }
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
