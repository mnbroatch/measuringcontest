# Reference: turn

The **turn** object configures how many moves each player gets per turn, who is active, optional stages, turn order, and automatic moves at the start of a turn. It is a top-level key in the game config (and can also appear inside a [phase](overview#phases) to override per phase).

## minMoves / maxMoves

Number of moves allowed per turn.

- **minMoves** — Minimum moves before the turn can end (default: `1` when omitted).
- **maxMoves** — Maximum moves in the turn (default: `1` when omitted).

When both are `1`, the player makes exactly one move then the turn advances.

**Example (Connect Four, Reversi):** one move per turn.

```json
"turn": {
  "minMoves": 1,
  "maxMoves": 1
}
```

## activePlayers

Maps who is currently acting to a **stage** name. Used with **stages** for multi-stage turns (e.g. “jump if possible” then “move” in checkers).

- Keys are typically **currentPlayer** (the player whose turn it is) or other player keys.
- Values are stage names that must exist in **stages**.

**Examples:**

- Checkers: current player starts in stage `jumpIfPossible`.
- Eights: current player in stage `normalPlay`.

```json
"activePlayers": { "currentPlayer": "jumpIfPossible" }
```

```json
"activePlayers": { "currentPlayer": "normalPlay" }
```

## stages

Optional map of stage names to stage configs. Each stage can define **initialMoves** (run when entering the stage) and **moves** (the moves available in that stage). Used together with **activePlayers** for games where a turn has multiple phases (e.g. checkers: jump stage → move stage).

- **initialMoves** — Array of move rules run when the stage becomes active (e.g. `SetActivePlayers` to switch to another stage if no jump is possible, or `PassTurn` when no moves exist).
- **moves** — Object of move names to move definitions (same shape as top-level **moves**).

See [Stages](stages) for more examples and patterns.

**Example (Checkers):** stage `jumpIfPossible` has `initialMoves` that switch to `moveIfNoJump` when there are no possible jumps, and defines moves like `jumpChecker`.

**Example (Eights):** stage `normalPlay` only defines **moves** (e.g. `playCard`).

## order

Configures turn order (who goes next).

- **playOrder** — e.g. `"RotateFirst"` to rotate the starting player (first player to act changes each round).

**Example (Eights):** first player rotates each round.

```json
"turn": {
  "order": {
    "playOrder": "RotateFirst"
  },
  "activePlayers": { "currentPlayer": "normalPlay" },
  ...
}
```

## initialMoves

Array of move rules run **at the start of each turn**, before the player chooses a move. Use for automatic actions (e.g. pass when no moves, or restock the deck).

**Example (Reversi):** pass the turn automatically when the current player has no legal moves.

```json
"turn": {
  "minMoves": 1,
  "maxMoves": 1,
  "initialMoves": [{
    "moveType": "PassTurn",
    "conditions": [{ "conditionType": "NoPossibleMoves" }]
  }]
}
```

**Example (Eights):** at turn start, move cards from discard (except top) back to stock, then shuffle stock.

```json
"initialMoves": [
  {
    "moveType": "ForEach",
    "arguments": { "targets": { ... }, "..." },
    "move": { "moveType": "MoveEntity", "..." }
  },
  {
    "moveType": "Shuffle",
    "arguments": { "target": { ... } }
  }
]
```

---

See [Overview](overview#turn) for where **turn** sits in the top-level structure.
