# Reference: Top-level structure

A B.A.G.E.L. game is a single JSON object. These are the top-level keys.

## entities

Array of entity definitions: boards, pieces, cards, etc.

```json
// Subset used in the built-in examples
{
  "name": "string",
  "entityType": "Grid" | "Space",        // omit for generic pieces/cards
  "width": number,                       // only when entityType === "Grid"
  "height": number,                      // only when entityType === "Grid"
  "perPlayer": boolean,                  // e.g. hands, scores, per-player markers
  "count": number | "Infinity",          // how many copies exist in the bank
  "state": { /* default attribute values */ },
  "displayProperties": ["string", "..."],
  "contentsHiddenFrom": "All" | "Others" // for hidden containers
}
```

- **name** — Identifier used in `sharedBoard`, `personalBoard`, conditions, and moves.
- **entityType** — `"Grid"` or `"Space"`. Omit for generic pieces/cards.
- **width** / **height** — For grids.
- **perPlayer** — If `true`, one copy per player (e.g. `hand`, `score`, `playerMarker`).
- **count** — Number of instances (`12` for checkers, `"Infinity"` for unbounded banks).
- **state** — Default state (e.g. `isKing: false`, `player: "0"`).
- **displayProperties** — Properties to show in the UI (e.g. `["value", "suit"]`).
- **contentsHiddenFrom** — `"All"` or `"Others"` for hidden containers (e.g. hands, stock).

The engine also injects built-in entities used by the examples: a `Space` type, a `sharedBoard` board, and a per-player `playerMarker` entity.

## sharedBoard / personalBoard

```json
// Subset used in the built-in examples
"sharedBoard": [
  { "name": "mainGrid" }
],
"personalBoard": [
  { "name": "hand" },
  { "name": "score" }
]
```

- **sharedBoard** — Array of simple matchers (usually by **name**) that form the shared board. Defaults to all entities if omitted.
- **personalBoard** — Optional. Array of matchers forming each player’s personal board (e.g. `hand`, `score`).

## initialPlacements

Optional array of placement objects (each with **entity** and **destination**) to place entities at setup. The engine converts these into internal `initialMoves`. Use **destination** with `name` (e.g. `mainGrid`) or `index` for a specific space.

## Players

```json
// Subset used in the built-in examples
{
  "numPlayers": 2,          // tic-tac-toe, or
  "minPlayers": 2,
  "maxPlayers": 2 | 5       // 5 in Eights
}
```

- **numPlayers** — Shorthand: sets both `minPlayers` and `maxPlayers`.
- **minPlayers** / **maxPlayers** — Allowed player count range.

## turn

Configures moves per turn, who is active, stages, turn order, and automatic start-of-turn moves.

```json
// Subset used in the built-in examples
"turn": {
  "minMoves": 1,
  "maxMoves": 1,
  "initialMoves": [ /* move rules (e.g. PassTurn when NoPossibleMoves) */ ],
  "activePlayers": { "currentPlayer": "stageName" },
  "stages": {
    "stageName": {
      "initialMoves": [ /* move rules when entering stage */ ],
      "moves": {
        "moveName": { /* move definition */ }
      }
    }
  },
  "order": {
    "playOrder": "RotateFirst"
  }
}
```

See [Turn](turn) for detailed descriptions of `initialMoves`, `activePlayers`, `stages`, and `order`.

## moves

Object mapping move names to move definitions.

```json
// Subset of move types used in the examples
"moves": {
  "moveName": {
    "moveType": "PlaceNew"
      | "MoveEntity"
      | "RemoveEntity"
      | "TakeFrom"
      | "SetState"
      | "SetActivePlayers"
      | "EndTurn"
      | "PassTurn"
      | "ForEach"
      | "Shuffle",
    "arguments": { /* per-move arguments like entity, destination, source, target */ },
    "conditions": [ /* optional top-level conditions for the move */ ],
    "then": [ /* follow-up move rules after a successful move */ ],
    "position": "First"      // only used by some MoveEntity/PlaceNew moves
  }
}
```

See [Moves](moves) for how each `moveType` uses `arguments` and `conditions`.

## endIf

Array of end scenarios.

```json
// Subset used in the built-in examples
"endIf": [
  {
    "conditions": [ /* condition objects */ ],
    "result": {
      "winner": "ownerOfFirstResultEntity"
        | { "type": "contextPath", "path": ["..."] }
        | { "type": "expression", "expression": "...", "arguments": { /* ... */ } },
      "draw": true,
      "winners": { "type": "mapMax", /* ... */ }
    }
  }
]
```

- **conditions** — Array of condition objects (e.g. `HasLine`, `IsFull`, `Some`, `Every`, `Evaluate`, `NoPossibleMoves`). All must be satisfied.
- **result** — Outcome when conditions are met. Values can use [value resolution](values-and-refs) (e.g. `contextPath`, `expression`, `mapMax`).

Legacy key **endConditions** is normalized to **endIf** by the engine.

## initialMoves

Optional array of move rules run once at game setup (after boards and initial placements). Used for things like dealing cards into hands.

## phases

Optional. Map of phase names to phase config (each can have `turn`, `moves`, `initialMoves`, `endIf`, `next`). Use phases for multi-phase games, like “setup”, “main play”, “scoring”, or different mini-games within one match. See [Phases](phases) for a full example and patterns.
