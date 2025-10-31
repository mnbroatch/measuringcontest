import pick from "lodash/pick.js";
import get from "./get.js";
import resolveExpression from "./resolve-expression.js";

// probably replaces some stuff in resolveArguments, esp. contextPath
export default function resolveProperties (bgioArguments, obj, context) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  let resolvedProperties = Array.isArray(obj)
    ? [...obj]
    : { ...obj }

  Object.entries(obj).forEach(([key, value]) => {
    resolvedProperties[key] = resolveProperty(bgioArguments, value, context)
  })

  return resolveProperty(bgioArguments, resolvedProperties, context)
}

// start migrating things here
function resolveProperty (bgioArguments, value, context) {
  if (value?.type === 'expression') {
    return resolveExpression(
      bgioArguments,
      {
        ...value,
        arguments: resolveProperties(bgioArguments, value.arguments, context)
      },
      undefined,
      context
    )
  } else if (value?.type === 'count') {
    return bgioArguments.G.bank.findAll(
      bgioArguments,
      value,
      context
    ).length
  } else if (value?.type === 'contextPath') {
    return get(context, value.path)
  } else if (value?.type === 'ctxPath') {
    return get(bgioArguments.ctx, value.path)
  } else if (value?.type === 'gamePath') {
    return get(bgioArguments.G, value.path)
  } else if (value?.type === 'RelativePath') {
    const target = resolveProperty(bgioArguments, value.target, context)
    return get(target.attributes, value.path)
  } else if (value?.type === 'map') {
    return getMappedTargets(
      bgioArguments,
      value.targets,
      value.mapping,
      context
    ).map(mappedTarget => mappedTarget.value)
  } else if (value?.type === 'mapMax') {
    const mappedTargets = getMappedTargets(
      bgioArguments,
      value.targets,
      value.mapping,
      context
    )
    let maxValue
    const maxTargets = []
    for (let i = 0, len = mappedTargets.length; i < len; i++) {
      const { target, value: val } = mappedTargets[i]
      if (maxValue === undefined || val > maxValue) {
        maxValue = val
        maxTargets.length = 0
        maxTargets.push(target)
      } else if (val === maxValue) {
        maxTargets.push(target)
      }
      return maxTargets
    }
  } else if (value?.type === 'Pick') {
    const target = resolveProperty(bgioArguments, value.target, context)
    if (target !== undefined) {
      return pick(
        resolveProperties(
          bgioArguments,
          target.attributes,
          context
        ),
        value.properties
      )
    }
  } else if (value?.type === 'RelativeCoordinates') {
    let parent = G.bank.findParent(context.originalTarget)
    const oldCoordinates =
      parent.getCoordinates(context.originalTarget.rule.index)
    const newCoordinates =
      parent.getRelativeCoordinates(oldCoordinates, value.location)
    resolvedTarget =
      newCoordinates && parent.spaces[parent.getIndex(newCoordinates)]
  } else if (value?.conditions) {
    return value.matchMultiple
      ? bgioArguments.G.bank.findAll(bgioArguments, value, context)
      : bgioArguments.G.bank.findOne(bgioArguments, value, context)
  } else {
    return value
  }
}

function getMappedTargets (bgioArguments, targetsRule, mapping, context) {
  const targets = resolveProperty(
    bgioArguments,
    targetsRule,
    context
  ) ?? []

  return targets.map(target => ({
    target,
    value: resolveProperty(
      bgioArguments,
      mapping,
      { ...context, loopTarget: target }
    )
  }))
}
