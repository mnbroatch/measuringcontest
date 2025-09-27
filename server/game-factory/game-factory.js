import filter from "lodash/filter.js";
import { serialize, deserialize } from "wackson";
import moveFactory from "./move/move-factory.js";
import Bank from "./piece/bank.js";

export default function gameFactory (rules, name) {
  const game = { name }

  game.setup = ({ ctx }) => {
    console.log('123', 123)
    const initialState = {};
    if (rules.entities) {
      const entityDefinitions = expandEntityDefinitions(rules.entities, ctx)
      game.bank = new Bank(entityDefinitions)
    }

    // todo: nested boards
    if (rules.initialSharedBoard) {
      const initialSharedBoardDefinitions =
        rules.initialSharedBoard.reduce((acc, boardMatcher) => [
          ...acc,
          ...filter(rules.entities, boardMatcher)
        ], [])

      console.log('456', 456)
      initialState.sharedBoard =
        initialSharedBoardDefinitions.map(b => game.bank.getOne(b))
    }
console.log('JSON.parse(serialize(initialState))', JSON.parse(serialize(initialState)))
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

  console.log('game', game)

  return game

  if (rules.endIf) {
    
  }
  
  




  console.log('game', game)

  return game


  return {
    name,
    moves: {
      clickCell({ G, ctx }, id) {
        const cells = [...G.cells];
        if (cells[id] === null) {
          cells[id] = ctx.currentPlayer;
          return { ...G, cells };
        }
      },
    },
    turn: {
      minMoves: 1,
      maxMoves: 1,
    },
    endIf: ({ G, ctx }) => {
      if (IsVictory(G.cells)) {
        return { winner: ctx.currentPlayer };
      }
      if (G.cells.filter((c) => c === null).length == 0) {
        return { draw: true };
      }
    }
  };
}

function IsVictory(cells) {
  const positions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const isRowComplete = (row) => {
    const symbols = row.map((i) => cells[i]);
    return symbols.every((i) => i !== null && i === symbols[0]);
  };

  return positions.map(isRowComplete).some((i) => i === true);
}

// create a new entity for each variant
function expandEntityDefinitions (entities, ctx) {
  return entities.reduce((acc, entity) => {
    const entityCopy = { ...entity }

    // perPlayer flag multiplies number of variants
    if (entityCopy.perPlayer) {
      if (entityCopy.variants) {
        entityCopy.variants = (new Array(ctx.numPlayers)).reduce((accu, _, i) => [
          ...accu,
          ...entityCopy.variants.map(variant => ({ ...variant, player: `${i}` }))
        ], [])
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
