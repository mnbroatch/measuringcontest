# Reference: Condition types

Conditions are used in move **arguments** (to restrict choices), in **endIf** (to detect win/draw), and in **initialMoves** / **then** (to decide when to run a move). Each condition object has a **conditionType** and type-specific fields.

In the built-in examples, conditions also use two shorthands (documented in [Shorthand](shorthand)):

- String conditions like `"isEmpty"` and `"isCurrentPlayer"`.
- A bare matcher object like `{ "entityType": "Space" }`, which the engine treats as `conditionType: "Is"` with that object as the matcher.

## Is

Match an entity (or the current **target**) against a **matcher**. Uses lodash-style matching on entity rule + state.

- **matcher** — Object with `name`, `type`, `player`, or state fields. **player** can be a resolved value (e.g. **ctxPath** `["currentPlayer"]`).
- **entity** — Optional. When present, the condition is checked against this entity instead of **target**.

**Shape used in examples:**

```json
{
  "conditionType": "Is",
  "target": { "type": "parent" },
  "matcher": { "name": "discard" }
}
```

## Not / Or

- **Not** — **conditions**: array of one or more conditions; passes when all fail.
- **Or** — **conditions**: array; passes when at least one passes.

**Shape used in examples:**

```json
{ "conditionType": "Not", "conditions": [{ "conditionType": "Contains" }] }
```

## Contains

The **target** (a space or container) contains something matching nested **conditions**. If no nested conditions, “contains anything”. Often used as **Not** + **Contains** for “empty”.

**Shape used in examples:**

```json
{
  "conditionType": "Contains",
  "conditions": [{ "conditionType": "Is", "matcher": { "player": "0" } }]
}
```

## ContainsSame

Used inside a **sequence** (see InLine / HasLine). All items in the segment share the same value for the given **properties** (e.g. `["player"]` for “same owner”).

**Shape used in examples:**

```json
{ "conditionType": "ContainsSame", "properties": ["player"] }
```

## Some / Every

Quantifiers over a set.

- **target** — A selector that yields multiple entities (examples use `matchMultiple: true` + `conditions`).
- **conditions** — Conditions that must hold for **Some** (at least one) or **Every** (all).

Used in: Connect Four (some space has a line of 4; every space filled → draw).

**Shape used in examples:**

```json
{
  "conditionType": "Some",
  "target": {
    "matchMultiple": true,
    "conditions": [{ "conditionType": "Is", "matcher": { "entityType": "Space" } }]
  },
  "conditions": [{ "conditionType": "InLine", "sequence": [{ "minCount": 4, "conditions": ["isCurrentPlayer"] }] }]
}
```

## InLine

The current **target** (usually a space) lies in a line (row/column/diagonal) that matches a **sequence**.

- **target** — Optional. Defaults to the context target (e.g. the chosen destination).
- **sequence** — Array of segment rules: **minCount** (or **maxCount**) and **conditions** that each segment must satisfy. Used for “in a line of N with same player” (Reversi, Connect Four).

## HasLine

The grid (or **target**) has at least one line matching the **sequence**. Same **sequence** shape as InLine.

- **target** — Entity name (string) or conditions for the grid.
- **sequence** - e.g. one segment with minCount 3 and conditions ContainsSame on properties ["player"] for three in a row.

Used in: tic-tac-toe, Connect Four.

## IsFull

**target** (grid or container) has no empty spaces. Used for draw when the board is full.

## Would

“Would this move be valid?” Used by the UI to highlight legal moves. Takes the same shape as the move’s argument conditions.

## NoPossibleMoves

True when there are no legal moves for the current move name (or current context). Used in **initialMoves** to allow **PassTurn** or to advance to another stage (e.g. “if no jump, go to move stage”).

## Evaluate

Boolean expression evaluated with [expr-eval](https://github.com/silentmatt/expr-eval).

- **expression** — String (e.g. `"player == '0'"`, `"passCount > 0"`).
- **arguments** — Object mapping variable names to resolved values (e.g. **ctxPath**, **gamePath**). Available inside **expression**.

Used in: Checkers (king row check, pass count for win).

## Position

Position-based condition (e.g. coordinates). See engine source for current parameters.

---

**target** — Many conditions accept an optional **target**. It can be a string (entity name), or an object with **type** and **path** (e.g. **contextPath**, **gamePath**) resolving to a space or entity. If omitted, the condition uses the current context **target** (e.g. the space being validated as a move destination).
