import matches from 'lodash/matches.js'
import resolveProperties from '../utils/resolve-properties.js'

function resolveMatcher (bgioArguments, matcher) {
  const resolvedMatcher = { ...matcher }
  delete resolvedMatcher.state
  delete resolvedMatcher.stateGroups
  return resolveProperties(bgioArguments, resolvedMatcher)
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
