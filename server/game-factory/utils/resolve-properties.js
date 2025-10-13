export default function resolveProperties (bgioArguments, obj) {
  const resolvedProperties = { ...obj}
  if (resolvedProperties.player === 'Current') {
    resolvedProperties.player = bgioArguments.ctx.currentPlayer
  }
  return resolvedProperties
}
