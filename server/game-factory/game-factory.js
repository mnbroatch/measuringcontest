import get from "lodash/get.js";
import { serialize, deserialize } from "wackson";
import moveFactory from "./move/move-factory.js";
import checkConditions from "./utils/check-conditions.js";
import areThereValidMoves from "./utils/any-valid-moves.js";
import { registry } from "./registry.js";
import Bank from "./bank/bank.js";
import expandGameRules from "./expand-game-rules.js";

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
      { matcher: { name: "sharedBoard" } }
    )

    if (rules.personalBoard) {
      initialState.personalBoards = bgioArguments.ctx.playOrder.map((playerID) => 
        initialState.bank.getOne(
          bgioArguments,
          {
            matcher: {
              name: "personalBoard",
              player: playerID,
            }
          }
        )
      )
    }

    rules.initialMoves?.forEach(moveRule => {
      moveFactory(moveRule).moveInstance.doMove({
        ...bgioArguments,
        G: initialState
      });
    })
    return JSON.parse(serialize(initialState));
  }

  if (rules.moves) {
    game.moves =
      Object.entries(rules.moves).reduce((acc, [name, moveDefinition]) => ({
        ...acc,
        [name]: moveFactory({ ...moveDefinition, name })
      }), {})
  }

  if (rules.turn) {
    game.turn = rules.turn
    game.turn.onBegin = ({ G, events, ctx, ...restBgioArguments }) => {
      if (rules.turn.passIfNoMoves && G.meta.passCount < ctx.numPlayers) {
        const bgioArguments = {
          G: deserialize(JSON.stringify(G), registry),
          ctx,
          events,
          ...restBgioArguments
        }
        if (!areThereValidMoves(bgioArguments, game.moves)) {
          G.meta.passCount++
          events.pass()
        } else {
          G.meta.passCount = 0
        }
      }
    }

    if (rules.turn?.stages) {
      Object.entries(rules.turn.stages).forEach(([stageName, stage]) => {
        if (stage.moves) {
          game.turn.stages[stageName].moves =
            Object.entries(stage.moves).reduce((acc, [name, moveDefinition]) => ({
              ...acc,
              [name]: moveFactory({ ...moveDefinition, name })
            }), {})
        }
      })
    }
  }

  if (rules.endIf) {
    game.endIf = ({ G, ...restBgioArguments }) => {
      const bgioArguments = {
        G: deserialize(JSON.stringify(G), registry),
        ...restBgioArguments
      }
      const matchingWinScenarioResult = getMatchingWinScenarioResult(bgioArguments, rules.endIf)
      if (matchingWinScenarioResult) {
        const resultRule = matchingWinScenarioResult.winScenario.result
        const result = {...resultRule}
        if (resultRule.winner) {
          result.winner = get(matchingWinScenarioResult, result.winner)
        }
        return result
      }
    }
  }

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

function getMatchingWinScenarioResult(bgioArguments, winScenarios) {
  for (const winScenario of winScenarios) {
    const conditionResults = checkConditions(bgioArguments, winScenario)
    if (conditionResults.conditionsAreMet) {
      return { winScenario, conditionResults }
    }
  }

  return null;
}
