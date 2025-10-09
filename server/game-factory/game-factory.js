import filter from "lodash/filter.js";
import get from "lodash/get.js";
import { serialize, deserialize } from "wackson";
import moveFactory from "./move/move-factory.js";
import conditionFactory from "./condition/condition-factory.js";
import { registry } from "./registry.js";
import Bank from "./bank/bank.js";

// Things we always want, don't need to configure, and
// want to treat as first-class citizens
const invariantEntities = [
  { type: "space" }
]

export default function gameFactory (rules, rulesHash) {
  const game = { name: rulesHash }

  game.setup = ({ ctx }) => {
    const initialState = {};
    let entityDefinitions
    if (rules.entities) {
      entityDefinitions = [
        ...invariantEntities,
        ...expandEntityDefinitions(rules.entities, ctx),
      ]
      initialState.bank = new Bank(entityDefinitions)
    }

    // todo: nested boards
    if (rules.initialSharedBoard) {
      const initialSharedBoardDefinitions =
        rules.initialSharedBoard.reduce((acc, boardMatcher) => [
          ...acc,
          ...filter(entityDefinitions, boardMatcher)
        ], [])

      initialState.sharedBoard =
        initialSharedBoardDefinitions.map(b => initialState.bank.getOne(b))
    }
    return JSON.parse(serialize(initialState, { deduplicateInstances: false }));
  }

  if (rules.moves) {
    game.moves =
      Object.entries(rules.moves).reduce((acc, [name, moveDefinition]) => ({
        ...acc,
        [name]: moveFactory(moveDefinition)
      }), {})
  }

  if (rules.turn) {
    game.turn = rules.turn
  }

  if (rules.endIf) {
    game.endIf = ({ G, ...restBgioArguments }) => {
      const bgioArguments = {
        G: deserialize(JSON.stringify(G), registry),
        ...restBgioArguments
      }
      const matchingWinConditionResult = getMatchingWinConditionResult(bgioArguments, rules.endIf)
      if (matchingWinConditionResult) {
        const resultRule = matchingWinConditionResult.winCondition.result
        const result = {...resultRule}
        if (resultRule.winner) {
          result.winner = get(matchingWinConditionResult, result.winner)
        }
        return result
      }
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

function getMatchingWinConditionResult(bgioArguments, winConditions) {
  for (const winCondition of winConditions) {
    const conditionResults = [];

    for (const cond of winCondition.conditions) {
      const conditionResult = conditionFactory(cond).check(bgioArguments);

      if (conditionResult.conditionIsMet) {
        conditionResults.push(conditionResult);
      } else {
        break;
      }
    }

    if (conditionResults.length === winCondition.conditions.length) {
      return { winCondition, conditionResults };
    }
  }

  return null;
}
