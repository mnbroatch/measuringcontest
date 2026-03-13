# Reference: Top-level structure

A B.A.G.E.L. game is a single JSON object. These are the top-level keys.

## entities

Array of entity definitions: boards, pieces, cards, etc.

- **name** — Identifier used in `sharedBoard`, `personalBoard`, conditions, and moves.
- **type** — `"Grid"` or `"Space"`. Omit for generic pieces/cards.
- **width** / **height** — For `type: "Grid"`, the grid dimensions.
- **perPlayer** — If `true`, one copy of the entity (or set) per player (e.g. hand, score).
- **count** — Number of instances (e.g. `12` for checkers, `"Infinity"` for unbounded).
- **state** — Default state (e.g. `isKing: false` or `player: "0"`).
- **displayProperties** — List of property names to show in the UI (e.g. `["value", "suit"]` for cards).
- **contentsHiddenFrom** — `"All"` or `"Others"` for hidden containers (e.g. hand).

The engine also injects built-in entities: a `Space` type, a `sharedBoard` board, and a per-player `playerMarker` entity.

## sharedBoard / personalBoard

- **sharedBoard** — Array of entity matchers (e.g. name `mainGrid`) that form the shared board. Defaults to all entities if omitted.
- **personalBoard** — Optional. Array of entity matchers that form each player’s personal board (e.g. hand, score). Creates a per-player board and places those entities there at setup.

## initialPlacements

Optional array of placement objects (each with **entity** and **destination**) to place entities at setup. The engine converts these into internal `initialMoves`. Use **destination** with `name` (e.g. `mainGrid`) or `index` for a specific space.

## Players

- **numPlayers** — Shorthand: sets both `minPlayers` and `maxPlayers`.
- **minPlayers** / **maxPlayers** — Allowed player count range.

## turn

- **minMoves** / **maxMoves** — Moves per turn (default when omitted: 1 and 1).
- **activePlayers** — Optional. Maps current player to a stage (e.g. currentPlayer → `"jumpIfPossible"`).
- **stages** — Optional. Map of stage names to objects with **initialMoves** and **moves**. Used for multi-stage turns (e.g. checkers: jump if possible → move → king pieces).

## moves

Object mapping move names to move definitions. Each definition has:

- **type** — One of: `PlaceNew`, `MoveEntity`, `RemoveEntity`, `TakeFrom`, `SetState`, `SetActivePlayers`, `EndTurn`, `PassTurn`, `ForEach`, `Pass`, `Shuffle`.
- **arguments** — Depends on the move type (e.g. `entity`, `destination`).
- **then** — Optional array of automatic follow-up move rules after a successful move.

See [Moves](moves) for details.

## endIf

Array of end scenarios. Each item:

- **conditions** — Array of condition objects. All must be satisfied.
- **result** — Outcome when conditions are met (e.g. **winner** or **draw: true**). Values can use [value resolution](values-and-refs) (e.g. contextPath, expression).

Legacy key **endConditions** is normalized to **endIf** by the engine.

## initialMoves

Optional array of move rules run once at game setup (after boards and initial placements). Used for things like dealing cards into hands.

## phases

Optional. Map of phase names to phase config (each can have `turn`, `moves`, `initialMoves`, `endIf`, `next`). For multi-phase games.
