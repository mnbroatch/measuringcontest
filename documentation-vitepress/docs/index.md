# Introduction to B.A.G.E.L.

**B.A.G.E.L.** (Board-based Automated Game Engine Language) is a JSON-based declarative language for defining board and card games. You describe entities (boards, pieces, cards), moves, turn structure, and end conditions in a single JSON object. A runtime interprets that definition and runs the game.

## How it fits together

1. **You write** a B.A.G.E.L. game definition (JSON).
2. **The editor** in this app lets you edit and test definitions live.
3. **The [board-game-engine](https://www.npmjs.com/package/board-game-engine)** npm package expands and normalizes the JSON, then produces a [boardgame.io](https://boardgame.io/)-compatible game.
4. **The game** runs in the browser (or on a server) using that engine.

Example games (tic-tac-toe, Connect Four, Reversi, Checkers, Eights) are included in this project under `server/` and can be loaded in the editor.

## What you can define

- **Entities** — Grids, spaces, pieces, cards (with optional state like “isKing” or “player”).
- **Boards** — Which entities form the shared board and, optionally, each player’s personal board (e.g. hand, score).
- **Moves** — Place new pieces, move or remove entities, take from stacks, change state, end or pass turns, run follow-up moves.
- **Turns** — Min/max moves per turn, optional stages (e.g. “must jump if possible” then “move or king”).
- **End conditions** — Win/draw when a line appears, board is full, or a custom expression is true.

## Next

Go to [Getting started](getting-started) to see a minimal example and run it in the editor.
