# Reference: Move types

Moves are defined under **moves** (or under **turn.stages.\<stage>.moves**). Each move has a **type** and **arguments**; many support **then** for automatic follow-up moves.

## PlaceNew

Puts an entity from the bank into a destination (space or container).

- **entity** — Matcher/conditions for which entity to place (e.g. current player’s marker). Supports `matchMultiple` and `count` to place several.
- **arguments.destination** — Where to place (conditions or matcher). Use **playerChoice: true** to let the player pick among valid destinations.
- **arguments.position** — Optional. Position in the destination (e.g. start/end of list).

Used in: tic-tac-toe (place marker), Connect Four (drop piece), Reversi (place disc), Eights (play card).

## MoveEntity

Moves an existing entity to a new destination.

- **arguments.entity** — Which entity to move (conditions; often **playerChoice: true**).
- **arguments.destination** — Where it can move (conditions; often **playerChoice: true**).

Used in: Checkers (move/jump), Reversi (flip by moving/capturing).

## RemoveEntity

Removes an entity from the game (e.g. capture).

- **arguments.entity** — Which entity to remove (conditions or contextPath). Often used inside **then** after a move (e.g. remove the jumped piece).

## TakeFrom

Takes an entity from a container (e.g. draw from deck).

- **arguments** — Define the source and, if needed, how many. Used in card games (draw from stock).

## SetState

Updates an entity’s state (e.g. promote to king).

- **arguments.entity** — The entity (often via **contextPath** or **ForEach** target).
- **arguments.state** — Object with **property** and **value** (e.g. property `"isKing"`, value `true`).

Used in: Checkers (king pieces that reach the back row).

## SetActivePlayers

Changes whose turn it is or which stage they’re in.

- **options** — e.g. set **currentPlayer** to stage `"kingPieces"` or `"moveIfNoJump"`.
- **conditions** — Optional. When to apply (e.g. **NoPossibleMoves** to advance stage only when no move is available).

Used in: Checkers (jumpIfPossible → moveIfNoJump → kingPieces).

## EndTurn / PassTurn

- **EndTurn** — Ends the current turn (e.g. after a normal move).
- **PassTurn** — Pass without making a move; often has a **conditions** array with one object: `conditionType: "NoPossibleMoves"`, so it only runs when there are no legal moves.

Both can appear in **initialMoves** of a turn or stage.

## ForEach

Runs a move once per target in a set.

- **arguments.targets** — Condition or resolution that yields multiple targets (e.g. **contextPath** to a list, or **map** over spaces).
- **move** — The move rule to run (e.g. **SetState**, **RemoveEntity**). The **loopTarget** is available in context for each iteration.

Used in: Checkers (king all pieces that reached the back row), Eights (deal cards to hands).

## Pass / Shuffle

- **Pass** — No-op (e.g. placeholder in a stage).
- **Shuffle** — Shuffles a container (e.g. deck). Used in card games.

---

**then** — Any move can have a **then** array of move rules. After the main move runs successfully, the engine runs these in order (with shared context, e.g. **moveArguments**, **originalTarget**). Used for captures (RemoveEntity after MoveEntity) or advancing stages (SetActivePlayers).
