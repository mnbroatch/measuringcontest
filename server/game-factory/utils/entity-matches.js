import matches from 'lodash/matches.js'

function resolveMatcher (bgioArguments, matcher) {
  const resolvedMatcher = { ...matcher }
  delete resolvedMatcher.state
  delete resolvedMatcher.stateGroups
  if (resolvedMatcher.player === 'Current') {
    resolvedMatcher.player = bgioArguments.ctx.currentPlayer
  }
  return resolvedMatcher
}

function getEntityMatcher (entity) {
  return {
    ...entity.rule,
    ...entity.state
  }
}

export default function entityMatches (bgioArguments, matcher, entity) {
  return matches(resolveMatcher(bgioArguments, matcher))(getEntityMatcher(entity))
}
