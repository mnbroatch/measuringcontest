# Appendix: Engine and boardgame.io

B.A.G.E.L. is interpreted by the [board-game-engine](https://www.npmjs.com/package/board-game-engine) npm package. The engine does not parse a custom text format; it takes a **game definition object** (the JSON you write) and:

1. **Expands** it (see [Shorthand](/reference/shorthand), key renames, default entities and boards).
2. **Builds** a [boardgame.io](https://boardgame.io/) game object: `setup`, `moves`, `turn`, `endIf`, optional `phases`, and `playerView` for hiding secret state.

So your B.A.G.E.L. JSON is the configuration for the engine; the engine outputs a boardgame.io-compatible game that runs in the browser or on a server. The app uses **board-game-engine-react** to render boards and pieces and to connect to the game state.

## Version

The behavior described in these docs matches **board-game-engine** as used by this project (see root `package.json`). New engine versions may add move types, condition types, or options; the docs can be extended as the language grows.

## Validation

There is no separate JSON Schema for B.A.G.E.L. yet. Invalid or unsupported structure is reported at runtime when the engine expands rules or when a move is executed.
