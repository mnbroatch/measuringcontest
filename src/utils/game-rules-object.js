/**
 * B.A.G.E.L. rules as stored/transmitted: either a JSON string or a parsed object.
 * board-game-engine / board-game-engine-react expect text
 */
export function normalizeGameRules (gameRules) {
  if (gameRules == null || gameRules === '') return undefined
  try {
    return typeof gameRules === 'string'
      ? JSON.stringify(JSON.parse(gameRules), null, 2)
      : JSON.stringify(gameRules, null, 2)
  } catch {
    return undefined
  }
}
