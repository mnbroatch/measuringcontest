# Example: Reversi (Othello)

Reversi uses an 8×8 grid, initial four discs in the center, and a **PlaceNew** move that must form a line (current space → existing disc of current player) with opponent discs in between; those get flipped (handled by the engine or follow-up moves).

## Entities

- **mainGrid** — Grid 8×8.
- **disc** — Count **Infinity**, state includes **player** (set when placed).

**initialPlacements** put two discs of player 0 and two of player 1 in the four center cells.

## Move

**PlaceNew**: entity is a **disc** with **player** from **ctxPath** `currentPlayer`. **destination** must be a **Space**, empty, and lie in an **InLine** **sequence**: (current space), then at least one opponent disc, then a disc of the current player (so the line is valid for flipping).

Turn has **initialMoves** with **PassTurn** when **NoPossibleMoves**.

## End condition

Game ends when no moves possible; winner is determined by disc count (or similar logic in **endIf** with **Evaluate** / **Every**).

Full definition: `server/reversi.json`, `server/reversi2.json`.
