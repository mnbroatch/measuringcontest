# Measuring Contest

A full-stack playground for designing and playing board/card games from a JSON DSL. Working title for an eventual game about measuring; the app is a live game editor, room/lobby flow, and multiplayer game runtime.

## What it is

- **B.A.G.E.L.** (Board-based Automated Game Engine Language) — a declarative JSON language for defining games: entities (grids, pieces, cards), moves, turn structure, stages, and end conditions. You write one JSON definition; a runtime expands it and produces a runnable game.
- **Editor** — In-browser editor (Monaco) to author and test B.A.G.E.L. definitions against a local game instance.
- **Rooms & multiplayer** — Create rooms, share a code, join/leave, then start a game from a chosen definition. A “room game” (lobby state) and the actual boardgame run on a shared game server; clients and backend both connect via WebSockets and JWT-secured API.

So: DSL → engine (normalization + boardgame.io compatibility) → game server + React client. Example games (tic-tac-toe, Connect Four, Reversi, Checkers, Eights) ship in the repo and can be loaded in the editor.

## Tech & approach

- **Frontend:** React 19, TanStack Router, TanStack Query, Monaco Editor, AWS Amplify (auth). Game UI and server connection via `board-game-engine-react`.
- **DSL / engine:** Custom JSON schema (shorthand expansion, condition/move/endIf system). The [board-game-engine](https://www.npmjs.com/package/board-game-engine) npm package compiles B.A.G.E.L. into [boardgame.io](https://boardgame.io/) games.
- **Backend:** AWS API Gateway + Lambda (Node), Cognito authorizer, DynamoDB for room metadata. Lambdas orchestrate room lifecycle and game creation; they also act as boardgame.io clients to drive a separate “RoomGame” (lobby state) on the game server.
- **Game server:** Long-lived boardgame.io server (Socket.IO). Clients and Lambdas connect with JWTs; Lambda uses Parameter Store for the shared secret.
- **CI/CD:** GitHub Actions; tag-based (`v*`) deploy of Lambdas via OIDC assume-role (no stored AWS keys).

## Running locally

Only the frontend and docs are set up for local runs; the API and game server are hosted.

```bash
npm install
npm start          # Webpack dev server (editor + app)
npm run docs:start # VitePress docs at documentation-vitepress
```

The app talks to `api.boardgameengine.com` and `gameserver.boardgameengine.com` by default (see `src/constants/api.js`). For a fully local backend you’d need your own API, game server, and auth configuration.

## Docs

In-repo docs (VitePress) live under `documentation-vitepress/`: intro to B.A.G.E.L., reference (entities, moves, conditions, shorthand), and examples. Build with `npm run docs:build`.
