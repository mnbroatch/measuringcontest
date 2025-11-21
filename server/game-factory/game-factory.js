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
      _meta: {
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

  turn.onBegin = (bgioArguments) => {
    const newG = doMoves(bgioArguments, turnRule.initialMoves)
    const stageRule = turnRule.stages?.[bgioArguments.ctx.activePlayers?.[bgioArguments.ctx.currentPlayer]]
    if (
      (
        turnRule.passIfNoMoves
        && newG._meta.noMovesCount < bgioArguments.ctx.numPlayers
      ) || (
        stageRule.onNoMoves
      )
    ) {
      const newBgioArguments = {
        ...bgioArguments,
        G: newG,
      }
      const thereAreValidMoves = areThereValidMoves(
        newBgioArguments,
        getCurrentMoves(game, newBgioArguments)
      )

      if (!thereAreValidMoves) {
        if (stageRule.onNoMoves) {
          doMoves(bgioArguments, stageRule.onNoMoves)
        }

        if (turnRule.passIfNoMoves) {
          newG._meta.passCount++
          newBgioArguments.events.pass()
        } else {
          newG._meta.passCount = 0
        }
      }
    }
    return JSON.parse(serialize(newG));
  }

  if (turnRule.stages) {
    Object.entries(turnRule.stages).forEach(([stageName, stageRule]) => {
      if (stageRule.moves) {
        turn.stages[stageName].moves = createMoves(stageRule.moves)
      }
    })
  }

  if (turnRule.order?.playOrder === 'RotateFirst') {
    turnRule.order.first = () => 0
    turnRule.order.next = ({ ctx }) => (ctx.playOrderPos + 1) % ctx.numPlayers
    turn.order.playOrder = ({ ctx, G }) => {
      return G._meta.isAfterFirstPhase
        ? [...ctx.playOrder.slice(1), ctx.playOrder[0]]
        : ctx.playOrder
    }
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
    const newG = doMoves(bgioArguments, phaseRule.initialMoves)
    newG._meta.currentPhaseHasBeenSetUp = true
    newG._meta.nextPhase = phaseRule.next
    return JSON.parse(serialize(newG));
  }

  if (phaseRule.endIf) {
    phase.endIf = ({ G, ...restBgioArguments }) => {
      const bgioArguments = {
        G: deserialize(JSON.stringify(G), registry),
        ...restBgioArguments
      }
      if (bgioArguments.G._meta.currentPhaseHasBeenSetUp) {
        const result = getScenarioResults(bgioArguments, phaseRule.endIf)
        if (result) {
          return result
        }
      }
    }
  }

  phase.onEnd = ({ G }) => {
    G._meta.currentPhaseHasBeenSetUp = false
    G._meta.isAfterFirstPhase = true
  }

  return phase
}

function doMoves (bgioArguments, moves = []) {
  const newG = deserialize(JSON.stringify(bgioArguments.G), registry)
  moves.forEach((moveRule) => {
    moveFactory(moveRule).moveInstance.doMove({
      ...bgioArguments,
      G: newG,
    });
  })
  return newG
}

function createMoves (moves) {
  return Object.entries(moves).reduce((acc, [name, moveDefinition]) => ({
    ...acc,
    [name]: moveFactory({ ...moveDefinition, name })
  }), {})
}
