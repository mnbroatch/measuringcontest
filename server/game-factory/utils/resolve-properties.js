import isPlainObject from "lodash/isPlainObject.js";
import pick from "lodash/pick.js";
import get from "./get.js";
import resolveExpression from "./resolve-expression.js";
import resolveEntity from "./resolve-entity.js";

// some keys only contain things that will be the root of a later resolution
const resolutionTerminators = [
  'conditions',
  'constraints',
  'move',
  'then',
  'mapping',
]

export default function resolveProperties (bgioArguments, obj, context) {
  if (!isPlainObject(obj) && !Array.isArray(obj)) {
    return obj
  }

  let resolvedProperties = Array.isArray(obj)
    ? [...obj]
    : { ...obj }

  Object.entries(obj).forEach(([key, value]) => {
    if (!resolutionTerminators.includes(key)) {
      resolvedProperties[key] = resolveProperties(bgioArguments, value, context)
    }
  })

  const resolved = resolveProperty(bgioArguments, resolvedProperties, context)

  return !resolved?.playerChoice && resolved?.constraints
    ? resolveEntity(
        bgioArguments,
        resolved,
        context
      )
    : resolved
}

function resolveProperty (bgioArguments, value, context) {
  if (value?.type === 'expression') {
    return resolveExpression(
      bgioArguments,
      {
        ...value,
        arguments: resolveProperties(bgioArguments, value.arguments, context)
      },
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
    const target = resolveProperties(bgioArguments, value.target, context)
    return get(target.attributes, value.path)
  } else if (value?.type === 'Parent') {
    return bgioArguments.G.bank.findParent(context.originalTarget) ?? null
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
    }
    return maxTargets
  } else if (value?.type === 'Pick') {
    const target = resolveProperties(bgioArguments, value.target, context)
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
    const parent = bgioArguments.G.bank.findParent(context.originalTarget)
    const oldCoordinates =
      parent.getCoordinates(context.originalTarget.rule.index)
    const newCoordinates =
      parent.getRelativeCoordinates(oldCoordinates, value.location)
    return newCoordinates && parent.spaces[parent.getIndex(newCoordinates)]
  } else {
    return value
  }
}

function getMappedTargets (bgioArguments, targetsRule, mapping, context) {
  return resolveProperties(bgioArguments, targetsRule, context)?.map(target => ({
    target,
    value: resolveProperties(
      bgioArguments,
      mapping,
      { ...context, loopTarget: target }
    )
  })) ?? []
}

