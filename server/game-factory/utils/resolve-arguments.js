import resolveProperties from "./resolve-properties.js";
import get from "./get.js";

// todo: change to resolve one arguments at a time? probably 2 composed fns
export default function resolveArguments (
  bgioArguments,
  moveRule,
  payload,
  context
) {
  return Object.entries(moveRule.arguments ?? {})
    .reduce((acc, [argName, argRule]) => {
      console.log('argRule', argRule)
      return {
        ...acc,
        [argName]: payload?.arguments?.[argName]
          ?? resolveProperties(bgioArguments, argRule, context)
      }
    }, {})
}

// beginning of migrating condition targets over here
export function resolveArguments2 (
  bgioArguments,
  conditionRule,
  originalTarget,
  context
) {
  const { G } = bgioArguments

  let resolvedTarget
  if (conditionRule.target.type === 'RelativeCoordinates') {
    let parent = G.bank.findParent(originalTarget)
    // // we always want the SpaceGroup, whether target is Space or Entity
    // while (parent.rule.type !== 'Grid') {
    //   parent = G.bank.findParent(parent)
    //   if (!parent) {
    //     throw new Error(`couldnt find Grid parent of entity with rule ${target.rule}`)
    //   }
    // }
    const oldCoordinates =
      parent.getCoordinates(originalTarget.rule.index)
    const newCoordinates =
      parent.getRelativeCoordinates(oldCoordinates, conditionRule.target.location)
    resolvedTarget =
      newCoordinates && parent.spaces[parent.getIndex(newCoordinates)]
  } else if (conditionRule.target.type === 'Parent') {
    resolvedTarget = G.bank.findParent(originalTarget)
  // } else if (argRule.type === 'RelativePath') {
  //   const target = bgioArguments.G.bank.findOne(bgioArguments, argRule.target, context)
  //   argument = get(target, argRule.path)
  } else if (conditionRule.target.type === 'contextPath') {
    resolvedTarget = get(context, conditionRule.target.path)
  } else if (conditionRule.target.type === 'ctxPath') {
    resolvedTarget = get(bgioArguments.ctx, conditionRule.target.path)
  } else {
    resolvedTarget = resolveTarget(
      bgioArguments,
      conditionRule.target,
      context
    )
  }
  return resolvedTarget
}

// want to move most stuff here
function resolveTarget (
  bgioArguments,
  targetRule,
  context
) {
  if (targetRule.type === 'contextPath') {
    return get(context, targetRule.path)
  } else if (true) {
    return targetRule.matchMultiple
      ? bgioArguments.G.bank.findAll(bgioArguments, targetRule, context)
      : bgioArguments.G.bank.findOne(bgioArguments, targetRule, context)
  }
}
