# Reference: Value resolution and references

Many fields in B.A.G.E.L. (move arguments, end results, conditions) accept **resolved values**: special objects that the engine replaces with a value from the game state or context. Use these in **matcher** properties, **result** values, **expression** arguments, and similar places.

## ctxPath

Path into **ctx** (boardgame.io context).

- **type**: `"ctxPath"`
- **path**: Array of keys, e.g. `["currentPlayer"]`, `["playOrder"]`.

Example: type `"ctxPath"`, path `["currentPlayer"]` for the current player ID.

## contextPath

Path into the **current evaluation context** (e.g. move validation, end check, ForEach loop).

- **type**: `"contextPath"`
- **path**: Array of keys/indexes into the context object.

Common context keys: **moveArguments** (arguments for the current move), **originalTarget** (the space/entity the player chose), **loopTarget** (current item in a ForEach), **target**, **results** (from condition evaluation, e.g. HasLine matches).

Example: winner from a HasLine result — path into `results[0].matches[0][0].entities[0].attributes.player`, or use shorthand **ownerOfFirstResultEntity**.

## gamePath

Path into the game state **G** (e.g. bank, _meta).

- **type**: `"gamePath"`
- **path**: Array, e.g. `["_meta", "previousPayloads", "jumpChecker", "arguments", "entity"]`, `["_meta", "passedPlayers", "length"]`.

Used in: Checkers (same piece must keep jumping; pass count for win).

## expression

Evaluate a formula with [expr-eval](https://github.com/silentmatt/expr-eval).

- **type**: `"expression"`
- **expression**: String (e.g. `"player == '0' ? -1 : 1"`, `"(currentPlayer + 1) % 2"`).
- **arguments**: Object mapping variable names to resolved values (which can use **ctxPath**, **contextPath**, **gamePath**, etc.).

Used in: Checkers (player-relative coordinates; winner when opponent passed).

## relativeCoordinates

Resolve to the space at a relative offset from a given space (e.g. “one step up-right”).

- **type**: `"relativeCoordinates"`
- **target** — Optional. Defaults to **originalTarget** in context. Resolves to a space.
- **location** — [dx, dy] or a resolved value (e.g. **expression** that returns different offsets per player).

Used in: Checkers (move/jump directions), Connect Four (space below for “gravity”).

## Coordinates

Absolute coordinates of a space in its parent grid.

- **type**: `"Coordinates"`
- **target** — Optional. Defaults to **originalTarget**. Resolves to a space; parent must be a Grid.

Used in: Checkers (king row: e.g. `destinationCoordinates[1] == 0` for player 0).

## RelativePath

Path into **target.attributes** (rule + state of an entity).

- **type**: `"RelativePath"`
- **target** — Resolved to an entity.
- **path** — Array of keys into that entity’s attributes.

## Parent

The parent container of a space or entity (e.g. the grid that contains the space).

- **type**: `"Parent"`
- **target** — Optional. Defaults to **originalTarget**.

## map

Map a set of targets to another value (e.g. “for each space, get this attribute”).

- **type**: `"map"`
- **targets** — Condition or resolution that yields multiple targets.
- **mapping** — Resolved for each target (with **loopTarget** in context). Result is the array of mapped values.

**mapMax** — Same as **map** but returns only the targets whose mapped value is maximum (e.g. “players with highest score”).

## Pick

Subset of attributes from a resolved entity.

- **type**: `"Pick"`
- **target** — Resolved to an entity.
- **properties** — Array of attribute names.

---

When documenting or writing game JSON, remember: **ctxPath** = boardgame.io context; **contextPath** = current B.A.G.E.L. evaluation context (move, end check, loop); **gamePath** = game state G.
