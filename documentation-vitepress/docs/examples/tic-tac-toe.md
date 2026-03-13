# Example: Tic-tac-toe

Tic-tac-toe is the minimal B.A.G.E.L. game: one grid, one move (place marker), two end conditions (win by line or draw).

## Entities

A single 3×3 grid:

```json
{
  "name": "mainGrid",
  "type": "Grid",
  "width": 3,
  "height": 3
}
```

The engine adds the shared board and per-player markers.

## Move

**PlaceNew** with entity **thatMatches** `"isCurrentPlayer"` and **destination** that is a **Space** and **isEmpty**, with **playerChoice: true** so the player picks the cell.

## End conditions

1. **HasLine** on `mainGrid` with **sequence** of 3 spaces that **ContainsSame** `player` → **winner**: **ownerOfFirstResultEntity**.
2. **IsFull** on `mainGrid` → **draw**: true.

See the full JSON in the app’s “Three in a Row” example or in `server/tic-tac-toe.json` / `server/tic-tac-toe2.json`.
