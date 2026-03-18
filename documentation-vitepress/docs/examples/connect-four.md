# Example: Connect Four

Connect Four uses a 7×6 grid, “gravity” (pieces stack from the bottom), and a win when four in a line share the same player.

## Entities

- **mainGrid** — Grid 7×6.
- **playerMarker** — Per-player, count **Infinity** (each drop is a new entity from the bank).

**sharedBoard** is set to an array with one matcher: name `mainGrid`.

## Move

**PlaceNew**: entity is the current player’s **playerMarker**; **destination** is a **Space**, **Not Contains** (empty), and the space **below** (relativeCoordinates `[0, 1]`) must **Not Contain** (so the column is filled from the bottom). **playerChoice: true** on destination so the player picks the column.

## End conditions

1. **Some** space in the grid has an **InLine** of 4 with **ContainsSame** `player` → **winner** is taken from the condition **contextPath** into the first result’s entities’ player.
2. **Every** space in the grid **Contains** (board full) → **draw**.

Full definition: `server/examples/connect-four.json`.
