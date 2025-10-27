import { serialize, deserialize } from "wackson";
import moveFactory from "./move/move-factory.js";
import areThereValidMoves from "./utils/any-valid-moves.js";
import getCurrentMoves from "./utils/get-current-moves.js";
import { registry } from "./registry.js";
import Bank from "./bank/bank.js";
import expandGameRules from "./expand-game-rules.js";
import getScenarioResults from './utils/get-scenario-results.js'

export default function gameFactory (gameRules, rulesHash, server) {
  const game = { name: rulesHash }
  const rules = expandGameRules(gameRules)

  game.setup = (bgioArguments) => {
    const { ctx } = bgioArguments
    const initialState = {
      meta: {
        passCount: 0,
      }
    };

    const entityDefinitions = expandEntityDefinitions(rules.entities, ctx)
    initialState.bank = new Bank(entityDefinitions)
    initialState.sharedBoard = initialState.bank.getOne(
      bgioArguments,
      {
        conditions: [{
          type: 'Is',
          matcher: { name: "sharedBoard" }
        }]
      }
    )

    if (rules.personalBoard) {
      initialState.personalBoards = bgioArguments.ctx.playOrder.map((playerID) => 
        initialState.bank.getOne(
          bgioArguments,
          {
            conditions: [{
              type: 'Is',
              matcher: {
                name: "personalBoard",
                player: playerID,
              }
            }]
          }
        )
      )
    }

    rules.initialMoves?.forEach((moveRule) => {
      moveFactory(moveRule).moveInstance.doMove({
        ...bgioArguments,
        G: initialState
      });
    })
    return JSON.parse(serialize(initialState));
  }

  if (rules.moves) {
    game.moves = createMoves(rules.moves)
  }

  if (rules.turn) {
    game.turn = createTurn(rules.turn, game)
  }

  if (rules.phases) {
    game.phases = Object.entries(rules.phases).reduce((acc, [name, phaseRule]) => ({
      ...acc,
      [name]: createPhase(phaseRule, game)
    }), {})
  }

  if (rules.endIf) {
    game.endIf = ({ G, ...restBgioArguments }) => {
      const bgioArguments = {
        G: deserialize(JSON.stringify(G), registry),
        ...restBgioArguments
      }
      return getScenarioResults(bgioArguments, rules.endIf)
    }
  }

  if (!gameRules.DEBUG_DISABLE_SECRET_STATE) {
    game.playerView = ({ G, playerID }) => {
      G = deserialize(JSON.stringify(G), registry)
      Object.values(G.bank.tracker).forEach(((entity) => {
        if (
          entity.rule.contentsHiddenFrom === 'All' 
           || (
              entity.rule.contentsHiddenFrom === 'Others'
                && (
                  playerID !== entity.rule.player
                  || playerID == undefined
                )
            )
        ) {
          if (entity.spaces) {
            entity.spaces = []
          }
          if (entity.entities) {
            entity.entities = []
          }
        }
      }))
      return JSON.parse(serialize(G))
    }
  }

  console.log('game', game)
  return game
}

// create a new entity for each variant
function expandEntityDefinitions (entities, ctx) {
  return entities.reduce((acc, entity) => {
    const entityCopy = { ...entity }

    // perPlayer flag multiplies number of variants
    if (entityCopy.perPlayer) {
      delete entityCopy.perPlayer
      if (entityCopy.variants) {
        entityCopy.variants =
          (new Array(ctx.numPlayers)).fill().reduce((accu, _, i) => [
            ...accu,
            ...entityCopy.variants.map(variant => ({ ...variant, player: `${i}` }))
          ], [])
      } else {
        entityCopy.variants =
          (new Array(ctx.numPlayers)).fill().map((_, i) => ({ player: `${i}` }))
      }
    }

    // variants becomes new entitites
    if (entityCopy.variants) {
      const variants = entityCopy.variants
      delete entityCopy.variants

      return [
        ...acc,
        ...variants.map(variant => ({
          ...entityCopy,
          ...variant,
        }))
      ]
    } else {
      return [
        ...acc,
        entityCopy
      ]
    }
  }, [])
}

function createTurn (turnRule, game) {
  const turn = { ...turnRule }

  turn.onBegin = ({ G, events, ctx, ...restBgioArguments }) => {
    if (turnRule.passIfNoMoves && G.meta.passCount < ctx.numPlayers) {
      const bgioArguments = {
        G: deserialize(JSON.stringify(G), registry),
        ctx,
        events,
        ...restBgioArguments
      }
      if (!areThereValidMoves(
        bgioArguments,
        getCurrentMoves(game, bgioArguments)
      )) {
        G.meta.passCount++
        events.pass()
      } else {
        G.meta.passCount = 0
      }
    }
  }

  if (turnRule.stages) {
    Object.entries(turnRule.stages).forEach(([stageName, stageRule]) => {
      if (stageRule.moves) {
        turn.stages[stageName].moves = createMoves(stageRule.moves)
      }
    })
  }
  return turn
}

function createPhase (phaseRule, game) {
  const phase = {...phaseRule}
  if (phaseRule.turn) {
    phase.turn = createTurn(phaseRule.turn, game)
  }
  if (phaseRule.moves) {
    phase.moves = createMoves(phaseRule.moves)
  }

  phase.onBegin = (bgioArguments) => {
    if (phaseRule.initialMoves) {
      phase.initialMoves.forEach((moveRule) => {
        moveFactory(moveRule)(bgioArguments);
      })
      bgioArguments.G.currentPhaseHasBeenSetUp = true
      return bgioArguments.G
    }
  }

  if (phaseRule.endIf) {
    phase.endIf = ({ G, ...restBgioArguments }) => {
      const bgioArguments = {
        G: deserialize(JSON.stringify(G), registry),
        ...restBgioArguments
      }
      if (bgioArguments.G.currentPhaseHasBeenSetUp) {
        const result = getScenarioResults(bgioArguments, phaseRule.endIf)
        if (result) {
          bgioArguments.G.currentPhaseHasBeenSetUp = false
          return result
        }
      }
    }
  }

  return phase
}

function createMoves (moves) {
  return Object.entries(moves).reduce((acc, [name, moveDefinition]) => ({
    ...acc,
    [name]: moveFactory({ ...moveDefinition, name })
  }), {})
}
