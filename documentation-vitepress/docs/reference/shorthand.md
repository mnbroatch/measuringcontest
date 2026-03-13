# Reference: Shorthand and legacy keys

The engine normalizes several shorthand forms and legacy keys so you can write less JSON. These are applied during **expand-game-rules** before the game runs.

## Key renames

| You write     | Becomes    |
|---------------|------------|
| **thatMatches** | **conditions** (value used as the single element or array of conditions) |
| **entityType**   | **type** (on entities) |
| **moveType**     | **type** (on moves) |
| **endConditions**| **endIf** |

So you can use **endConditions** instead of **endIf**, and **thatMatches** instead of **conditions** when there’s only one condition or you pass an array.

## Condition shorthands

When a **condition** value is a **string**, it is replaced as follows:

| String                    | Expands to |
|---------------------------|------------|
| **isCurrentPlayer**       | Is condition with matcher player from ctxPath currentPlayer |
| **isEmpty**               | Not condition wrapping a single Contains condition |

So you can write **thatMatches**: `"isCurrentPlayer"` or `"isEmpty"` instead of the full condition object.

## Result shorthand

| You write                    | Expands to |
|------------------------------|------------|
| **ownerOfFirstResultEntity** | contextPath into results, first match, first entity, attributes.player |

Used in **endIf** when the win comes from a **HasLine** (or similar) condition: the winner is the owner of the first entity in the first match. So you can set **result** winner to `"ownerOfFirstResultEntity"` instead of writing the long contextPath.

## Single condition to array

If you pass a single condition object where an array is expected (e.g. **conditions**), the engine wraps it in an array. So **thatMatches** with an array like `"type": "Space"` and `"isEmpty"` is valid.

## Default condition type: Is

If an object in a **conditions** array has no **conditionType**, the engine sets **conditionType** to **"Is"** and uses the object as the **matcher**. So you can write a single object with **type**: `"Space"` instead of wrapping it in an Is condition with matcher.

## target as string

If **target** is a string (e.g. `"mainGrid"`), it is expanded to an Is condition with matcher name equal to that string.

So you can write **target**: `"mainGrid"` in conditions that accept a target.
