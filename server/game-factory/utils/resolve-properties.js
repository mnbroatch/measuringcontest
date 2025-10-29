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
    return resolveExpression(bgioArguments, value, undefined, context)
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
  } else if (value?.mapMax) {
    const targets = resolveProperty(bgioArguments, value.mapMax.targets, context)
    let maxValue
    let maxTargets = []
    for (let i = 0, len = targets.length; i < len; i++) {
      const target = targets[i]
      const val = resolveProperty(
        bgioArguments,
        value.mapMax.mapping,
        { ...context, loopTarget: target }
      )
      if (maxValue === undefined || val > maxValue) {
        maxValue = val
        maxTargets = [target]
      } else if (val === maxValue) {
        maxTargets.push(target)
      }
    }
    return maxTargets
  } else {
    return value
  }
}
