import get from "./get.js";

export default function resolveProperties (bgioArguments, obj, context) {
  const resolvedProperties = { ...obj }
  if (resolvedProperties.player === 'Current') {
    resolvedProperties.player = bgioArguments.ctx.currentPlayer
  }
  Object.entries(obj).forEach(([key, value]) => {
    if (value?.contextPath) {
      resolvedProperties[key] = get(context, value.contextPath)
    }
  })
  return resolvedProperties
}
