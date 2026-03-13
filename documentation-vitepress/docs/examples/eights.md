# Example: Eights (card game)

Eights uses personal and shared boards: hands (hidden from others), discard, stock (hidden from all), and score. Cards are dealt from stock into hands; players play or draw.

## Entities

- **score** — **perPlayer**, **displayProperties**: `["value"]`, state **value: 0**.
- **hand** — **type: Space**, **perPlayer**, **contentsHiddenFrom**: `"Others"`.
- **discard** — **type: Space**, shared.
- **stock** — **type: Space**, **contentsHiddenFrom**: `"All"`.
- **card** — Many entries with **value** and **suit** (e.g. 1–13, clubs/hearts/spades/diamonds), **displayProperties**: `["value", "suit"]`.

**sharedBoard**: stock, discard. **personalBoard**: hand, score.

## Setup

**initialMoves**: **PlaceNew** (matchMultiple) entities matching **card** into **destination** matching **hand**, with a **ForEach** or similar over players so each player gets a hand. Stock is filled with the remaining cards (often via **TakeFrom** or placement from bank).

## Moves

Typical moves: **TakeFrom** stock → hand (draw), or **PlaceNew** from hand to discard (play). Legal play is usually expressed with conditions (e.g. match suit or value with top of discard). **Shuffle** can be used when stock is empty and discard is reshuffled.

Full definition: `server/eights.json`, `server/eights2.json`.
