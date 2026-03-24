/**
 * B.A.G.E.L. rules as stored/transmitted: either a JSON string or a parsed object.
 * board-game-engine / board-game-engine-react expect a plain object.
 */
export function toGameRulesObject (gameRules) {
  if (gameRules == null || gameRules === '') return undefined
  if (typeof gameRules === 'object') return gameRules
  try {
    return JSON.parse(gameRules)
  } catch {
    return undefined
  }
}

/** Monaco / read-only editors want a string value. */
export function formatGameRulesForDisplay (gameRules) {
  if (gameRules == null || gameRules === '') return ''
  if (typeof gameRules === 'string') return gameRules
  return JSON.stringify(gameRules, null, 2)
}
