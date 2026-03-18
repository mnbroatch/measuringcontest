# Introduction to B.A.G.E.L.

**B.A.G.E.L.** (Board-based Automated Game Engine Language) is a JSON-based declarative language for defining board and card games. You describe entities (boards, pieces, cards), moves, turn structure, and end conditions in a single JSON object.

There is a runtime, [board-game-engine](https://www.npmjs.com/package/board-game-engine), that automatically creates a playable prototype from a B.A.G.E.L. rule definition.

## What you can define

- **Entities** — Grids, pieces, spaces, etc.
- **Boards** — Which entities form the shared board optionally, each player’s personal board (e.g. their hand, tableau, stock). Nestable.
- **Moves** — Make changes to the game state
- **Turns** — Min/max moves per turn, optional stages (e.g. "must jump if possible" then "move or king"). Follows [boardgame.io turn rules](https://boardgame.io/documentation/#/api/Game) pretty closely.
- **End conditions** — End game when some condition is met. When game ends, defines a specified value as the gameover state

## Next

Go to [Getting started](getting-started) to see a minimal example and run it in the editor.
