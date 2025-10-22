import matches from 'lodash/matches.js'
import resolveProperties from '../utils/resolve-properties.js'

function resolveMatcher (bgioArguments, matcher, context) {
  const resolvedMatcher = { ...matcher }
  delete resolvedMatcher.state
  delete resolvedMatcher.stateGroups
  return resolveProperties(bgioArguments, resolvedMatcher, context)
}

function getEntityMatcher (entity) {
  return {
    ...entity.rule,
    ...entity.state
  }
}

export default function entityMatches (bgioArguments, matcher, entity, context) {
  const x = matches(resolveMatcher(bgioArguments, matcher, context))(getEntityMatcher(entity))
  if (x) {
    console.log('----------')
    console.log('resolveMatcher(bgioArguments, matcher, context)', resolveMatcher(bgioArguments, matcher, context))
    console.log('matcher', matcher)
    console.log('entity', entity)
  }
  return x
}
