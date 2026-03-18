# Example: Checkers

Checkers uses an 8×8 grid, 12 pieces per player, move vs jump (with mandatory jump), and kinging.

## Entities

- **mainGrid** — Grid 8×8.
- **checker** — **perPlayer**, count 12, state **isKing: false**, **displayProperties**: `["isKing"]`.

**initialPlacements** put each player’s checkers on their first three rows.

## Turn stages

- **jumpIfPossible** — **activePlayers**: currentPlayer in this stage. **initialMoves**: if **NoPossibleMoves** for jump, set stage to **moveIfNoJump**. **moves**: **jumpChecker** (MoveEntity with **then**: RemoveEntity on jumped piece, then SetActivePlayers to **keepJumping**).
- **keepJumping** — Same jump move; when no more jumps, SetActivePlayers to **kingPieces**.
- **moveIfNoJump** — **initialMoves**: PassTurn if no move. **moves**: **moveChecker** (MoveEntity one step diagonally), then SetActivePlayers to **kingPieces**.
- **kingPieces** — **initialMoves**: **ForEach** over spaces that **Contains** a piece and are on the back row (using **Evaluate** with **coordinates** and **relativePath** to player), **SetState** **isKing: true**; then **EndTurn**.

Move/jump **destination** conditions use **relativeCoordinates** with **expression** to choose direction by player (e.g. `player == '0' ? [-1,1] : [1,-1]`). **InLine** ensures the jumped piece is between source and destination.

## End condition

**endIf**: **Evaluate** `passCount > 0` (using **gamePath** to `_meta.passedPlayers.length`) → **winner** is **expression** `(currentPlayer + 1) % 2` (opponent of who just passed).

Full definition: `server/examples/checkers.json`.
