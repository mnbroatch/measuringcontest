import filter from "lodash/filter.js";
import { serialize, deserialize } from "wackson";
import moveFactory from "./move/move-factory.js";
import Bank from "./piece/bank.js";

export default function gameFactory (rules, name) {
  const game = { name }

  game.setup = ({ ctx }) => {
    const initialState = {};
    if (rules.entities) {
      const entityDefinitions = expandEntityDefinitions(rules.entities, ctx)
      initialState.bank = new Bank(entityDefinitions)
    }

    // todo: nested boards
    if (rules.initialSharedBoard) {
      const initialSharedBoardDefinitions =
        rules.initialSharedBoard.reduce((acc, boardMatcher) => [
          ...acc,
          ...filter(rules.entities, boardMatcher)
        ], [])

      initialState.sharedBoard =
        initialSharedBoardDefinitions.map(b => initialState.bank.getOne(b))
    }
    return JSON.parse(serialize(initialState));
  }

  if (rules.moves) {
    game.moves =
      Object.entries(rules.moves).reduce((acc, [name, moveDefinition]) => ({
        ...acc,
        [name]: moveFactory(moveDefinition)
      }), {})
  }

  // is this already a default? if so delete. if not, put in expanded json
  if (!rules.turn) {
    game.turn = {
      minMoves: 1,
      maxMoves: 1,
    }
  }

  if (rules.endIf) {
    
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
        entityCopy.variants = (new Array(ctx.numPlayers)).fill().reduce((accu, _, i) => [
          ...accu,
          ...entityCopy.variants.map(variant => ({ ...variant, player: `${i}` }))
        ], [])
      } else {
        entityCopy.variants = (new Array(ctx.numPlayers)).fill().map((_, i) => ({ player: `${i}` }))
      }
    }

    // variants becomes new entitites
    if (entityCopy.variants) {
      return [
        ...acc,
        ...entityCopy.variants.map(variant => ({
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
