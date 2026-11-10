/**
 * B.A.G.E.L. rules as stored/transmitted: either a JSON string or a parsed object.
 * board-game-engine / board-game-engine-react expect text
 */
export function normalizeGameRules (gameRules) {
  if (gameRules == null || gameRules === '') return undefined
  if (typeof gameRules === 'object') return gameRules
  try {
    return JSON.stringify(JSON.parse(gameRules), null, 2)
  } catch {
    return undefined
  }
}
