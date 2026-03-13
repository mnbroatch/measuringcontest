# Getting started

This page walks through a minimal B.A.G.E.L. game: a 3×3 grid, one move (place a marker), and two end conditions (win by line or draw when full).

## Minimal game: three in a row

See the full example in the repo at `server/tic-tac-toe2.json`. Summary:

- **entities**: one Grid named `mainGrid`, width 3, height 3
- **numPlayers**: 2
- **moves.placePlayerMarker**: type `PlaceNew`, entity thatMatches `isCurrentPlayer`, destination thatMatches a Space and isEmpty, playerChoice true
- **endConditions**: (1) HasLine on mainGrid, sequence of 3 with ContainsSame player → winner ownerOfFirstResultEntity; (2) IsFull on mainGrid → draw

## What each part does

- **entities** — One grid named `mainGrid`, 3×3. The engine also adds a shared board and per-player “playerMarker” entities.
- **numPlayers** — 2 (equivalent to `minPlayers` and `maxPlayers` both 2).
- **moves.placePlayerMarker** — A **PlaceNew** move: take an entity that matches “current player’s marker” and place it at a **destination** that is a **Space** and **isEmpty**. The player picks the destination (`playerChoice: true`).
- **endConditions** — Two outcomes:
  1. If the grid **HasLine** of 3 spaces that **ContainsSame** `player` → **winner** is the owner of the first such entity (shorthand: `ownerOfFirstResultEntity`).
  2. If the grid **IsFull** → **draw**.

Shorthand used here: `thatMatches` (→ `conditions`), `isCurrentPlayer`, `isEmpty`, `endConditions` (→ `endIf`). See [Shorthand](/reference/shorthand) for the full list.

## Try it in the editor

1. Open the app’s game editor (where you define games).
2. Choose the “Three in a Row” example or paste the JSON above into a blank game.
3. Run a test game and confirm win/draw behavior.

From here, explore [Reference](reference/overview) for the full structure, [Moves](reference/moves) and [Conditions](reference/conditions), or the [Examples](examples/tic-tac-toe) for more complex games.
