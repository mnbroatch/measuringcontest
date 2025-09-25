import filter from "lodash/filter";

export default function gameFactory (rules, name) {
  const game = {}

  game.setup = () => {
    const initialState = {};

    if (rules.initialSharedBoard) {
      initialState.sharedBoard = new Board
      rules.initialSharedBoard.forEach((board) => {
        initialState.sharedBoard.push(...expandPieces(filter(rules.entities, board)))
      })
    }

    return initialState;
  }
  






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

function expandPieces (pieces) {
  return pieces
}
