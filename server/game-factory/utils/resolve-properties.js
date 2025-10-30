import pick from "lodash/pick.js";
import get from "./get.js";
import resolveExpression from "./resolve-expression.js";

// probably replaces some stuff in resolveArguments, esp. contextPath
export default function resolveProperties (bgioArguments, obj, context) {
  let resolvedProperties = Array.isArray(obj) ? [...obj] : { ...obj }

  // don't like this special case here but how else to merge props
  Object.entries(obj).forEach(([key, value]) => {
    if (key === 'pick' && value?.target) {
      const target = bgioArguments.G.bank.findOne(
        bgioArguments,
        value.target,
        context
      )
      const newProperties = pick(
        resolveProperties(
          bgioArguments,
          target.attributes,
          context
        ),
        value.properties
      )
      Object.assign(resolvedProperties, newProperties)
      delete resolvedProperties.pick
    } else {
      resolvedProperties[key] = resolveProperty(bgioArguments, value, context)
    }

    // experimental, maybe this is sufficiently recursive?
    if (typeof resolvedProperties[key] === 'object' && resolvedProperties[key] !== null) {
      resolvedProperties[key] = resolveProperties(bgioArguments, resolvedProperties[key], context)
    }
  })

  return resolvedProperties
}

// start migrating things here
function resolveProperty (bgioArguments, value, context) {
  if (value?.ctxPath) {
    return get(bgioArguments.ctx, value.ctxPath)
  } else if (value?.expression) {
    return resolveExpression(
      bgioArguments,
      {
        ...value,
        arguments: resolveProperties(bgioArguments, value.arguments, context)
      },
      undefined,
      context
    )
  } else if (value === 'CurrentPlayer') {
    // should we just use ctxpath
    return bgioArguments.ctx.currentPlayer
  } else if (value?.contextPath) {
    return get(context, value.contextPath)
  } else if (value?.type === 'count') {
    return bgioArguments.G.bank.findAll(
      bgioArguments,
      value,
      context
    ).length
  } else if (value?.conditions) {
    return value.matchMultiple
      ? bgioArguments.G.bank.findAll(bgioArguments, value, context)
      : bgioArguments.G.bank.findOne(bgioArguments, value, context)
  } else if (value?.mapMax) {
    const mappedTargets = getMappedTargets(
      bgioArguments,
      value.mapMax.targets,
      value.mapMax.mapping,
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
  } else if (value?.map && !Array.isArray(value)) {
    return getMappedTargets(
      bgioArguments,
      value.map.targets,
      value.map.mapping,
      context
    ).map(mappedTarget => mappedTarget.value)
  } else {
    return value
  }
}

function getMappedTargets (bgioArguments, targets, mapping, context) {
  console.log('targets', targets)
  const x = resolveProperty(
    bgioArguments,
    targets,
    context
  ) ?? []

console.log('x', x)

    return x.map(target => ({
      target,
      value: resolveProperty(
        bgioArguments,
        mapping,
        { ...context, loopTarget: target }
      )
    }))
}
