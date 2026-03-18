# Reference: stages

Stages are **sub-steps inside a turn**. They let you say things like “first check for forced jumps, then if none exist, switch to a normal move stage”.

Stages live under `turn.stages` and work together with `turn.activePlayers`.

## Shape

```json
"turn": {
  "activePlayers": { "currentPlayer": "someStage" },
  "stages": {
    "someStage": {
      "initialMoves": [ { "...": "..." } ],
      "moves": {
        "moveName": { "...": "..." }
      }
    },
    "otherStage": { "...": "..." }
  }
}
```

Each stage can define:

- **initialMoves** — Array of move rules that run when entering the stage (e.g. to auto-pass, or switch stages if there are no legal moves).
- **moves** — Map of move names to move definitions that are **only available in this stage**.

`activePlayers` maps which players are currently acting to stage names:

- Keys are usually `currentPlayer` (the player whose turn it is).
- Values are stage names from `stages` (e.g. `"jumpIfPossible"`, `"normalPlay"`).

## Example: forced jumps in Checkers

Checkers uses two stages:

- **jumpIfPossible** — First stage: if jumps exist, the player must jump.
- **moveIfNoJump** — Second stage: if no jumps exist, allow normal moves.

```json
"turn": {
  "activePlayers": { "currentPlayer": "jumpIfPossible" },
  "stages": {
    "jumpIfPossible": {
      "initialMoves": [{
        "moveType": "SetActivePlayers",
        "options": {
          "currentPlayer": { "stage": "moveIfNoJump" }
        },
        "conditions": [{ "conditionType": "NoPossibleMoves" }]
      }],
      "moves": {
        "jumpChecker": {
          "moveType": "MoveEntity",
          "arguments": { "...": "..." }
        }
      }
    },
    "moveIfNoJump": {
      "moves": {
        "moveChecker": {
          "moveType": "MoveEntity",
          "arguments": { "...": "..." }
        }
      }
    }
  }
}
```

## Example: normalPlay stage in Eights

Eights has a `normalPlay` stage used during its `play` phase:

```json
"turn": {
  "activePlayers": { "currentPlayer": "normalPlay" },
  "stages": {
    "normalPlay": {
      "moves": {
        "playCard": {
          "moveType": "MoveEntity",
          "position": "First",
          "arguments": { "...": "..." }
        }
      }
    }
  }
}
```

## How to use stages

- **Model multi-step turns**: Use stages when a single turn has distinct steps (e.g. forced capture, bonus move, clean-up).
- **Gate moves by stage**: Put moves under the stage where they’re legal; a move is only available when its stage is active for that player.
- **Transition with initialMoves**: Use a stage’s `initialMoves` to automatically switch stages (e.g. via `SetActivePlayers`) or to auto-pass when there are no valid moves.

See [Turn](turn#stages) for how stages fit into the turn config, and how they interact with `minMoves`, `maxMoves`, and `initialMoves`.

