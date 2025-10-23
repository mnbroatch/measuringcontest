import pick from "lodash/pick.js";
import get from "./get.js";

// probably merge better with resolveArguments, esp. contextPath
// can Current be merged with ctxPath?
// should this be recursive?
export default function resolveProperties (bgioArguments, obj, context) {
  let resolvedProperties = { ...obj }
  Object.entries(obj).forEach(([key, value]) => {
    if (key === 'player' && value === 'Current') {
      resolvedProperties.player = bgioArguments.ctx.currentPlayer
    } else if (value?.contextPath) {
      resolvedProperties[key] = get(context, value.contextPath)
    } else if (key === 'contextPath') {
      // ok this is getting ridiculous
      console.log('context', context)
      console.log('value', value)
      resolvedProperties = get(context, value)
    } else if (key === 'pick' && value?.target?.conditions) {
      // this is the only one that replaces properties object? bugs found here
      const target = bgioArguments.G.bank.findOne(
        bgioArguments,
        value.target,
        context
      )
      // manual merging of state makes it seem like this should be different
      resolvedProperties = {
        ...resolvedProperties,
        ...pick(resolveProperties(
            bgioArguments,
            { ...target.rule, ...target.state },
            context
          ),
          value.properties
        )
      }
      delete resolvedProperties.pick
      } else if (key === 'mapMax') {
        const targets = resolveProperty(bgioArguments, value.targets, context)
        let maxValue
        let maxTargets = []
        for (let i = 0, len = targets.length; i < len; i++) {
          const target = targets[i]
          const val = resolveProperty(
            bgioArguments,
            value.mapping,
            { ...context, loopTarget: target }
          )
          if (maxValue === undefined || val > maxValue) {
            maxValue = val
            maxTargets = [target]
          } else if (val === maxValue) {
            maxTargets.push(target)
          }
        }
        resolvedProperties = maxTargets
      }
  })
  return resolvedProperties
}

// start migrating things here
function resolveProperty (bgioArguments, value, context) {
  if (value?.ctxPath) {
    return get(bgioArguments.ctx, value.ctxPath)
  } else if (value?.type === 'count') {
    return bgioArguments.G.bank.findAll(
      bgioArguments,
      value,
      context
    ).length
  }
}
