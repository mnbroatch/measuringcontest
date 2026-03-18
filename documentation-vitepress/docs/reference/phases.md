# Reference: phases

Phases let you split a game into named chunks like **setup**, **play**, and **scoring**. Each phase can have its own `turn`, `moves`, `initialMoves`, and `endIf`, plus a `next` phase to switch to.

The `phases` object lives at the top level of the game config.

## Shape

```json
"phases": {
  "phaseName": {
    "start": true,
    "turn": { "...": "..." },
    "moves": { "...": "..." },
    "initialMoves": [ { "...": "..." } ],
    "endIf": [ { "...": "..." } ],
    "next": "otherPhaseName"
  },
  "otherPhaseName": { "...": "..." }
}
```

Common properties per phase:

- **start** — Optional. If `true`, this phase is the starting phase (if omitted, the engine chooses a default).
- **turn** — Per-phase turn config. Same shape as [turn](turn) (e.g. `minMoves`, `maxMoves`, `activePlayers`, `stages`, `initialMoves`).
- **moves** — Moves available only in this phase.
- **initialMoves** — Move rules that run at the start of each turn **in this phase**.
- **endIf** — End conditions checked while this phase is active.
- **next** — Phase name to switch to when this phase ends (e.g. after `endIf` triggers).

## Example: play → score (Eights-style)

In the `Eights` example, the game has a `play` phase that deals and plays cards, then a `score` phase:

```json
"phases": {
  "play": {
    "start": true,
    "next": "score",
    "initialMoves": [
      {
        "moveType": "MoveEntity",
        "arguments": {
          "entity": {
            "matchMultiple": true,
            "conditions": [{ "conditionType": "Is", "matcher": { "name": "card" } }]
          },
          "destination": {
            "conditions": [{ "conditionType": "Is", "matcher": { "name": "stock" } }]
          }
        }
      },
      {
        "moveType": "Shuffle",
        "arguments": {
          "target": {
            "conditions": [{ "conditionType": "Is", "matcher": { "name": "stock" } }]
          }
        }
      }
    ],
    "turn": { "...": "..." },
    "moves": { "...": "..." },
    "endIf": [ { "...": "..." } ]
  },
  "score": {
    "initialMoves": [ { "...": "..." } ],
    "endIf": [
      {
        "conditions": [ { "conditionType": "Always" } ],
        "result": { "winner": { "...": "..." } }
      }
    ]
  }
}
```

## How to use phases

- **Isolate rules per phase**: Put phase-specific `moves`, `turn`, `initialMoves`, and `endIf` under that phase. The engine uses the active phase’s config instead of the top-level keys.
- **Switch between phases**: Use `next` to move automatically when `endIf` triggers, or drive phase changes with moves (e.g. by writing to a meta field that your `endIf` checks).
- **Share common rules**: Keep rules that apply to all phases (like global `endIf` or general moves) at the top level, and override or extend them inside individual phases when needed.

See [Overview](overview#phases) for where `phases` sits in the top-level structure.

