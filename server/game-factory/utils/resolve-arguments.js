// what the heck happened here?
// duck typing contextPath
// but using type === 'RelativePath'
// but also targetingType === 'Parent'
//
// gonna be a good refactor
import get from "./get.js";

// todo: change to resolve one arguments at a time? probably 2 composed fns
export default function resolveArguments (
  bgioArguments,
  moveRule,
  payload,
  context
) {
  return Object.entries(moveRule.arguments ?? {}).reduce((acc, [argName, argRule]) => {
    let argument = payload?.arguments?.[argName]
    if (!argument) {
      if (argRule.literal !== undefined) {
        argument = argRule.literal
      } else if (argRule.contextPath) {
        argument = get(context, argRule.contextPath)
      } else if (argRule.ctxPath) {
        // getting player list from playOrder, does this exist for custom turn order?
        argument = get(bgioArguments.ctx, argRule.ctxPath)
      } else if (argRule.gamePath) {
        argument = get(bgioArguments.G, argRule.gamePath)
      } else if (argRule.conditions) {
        argument = argRule.matchMultiple
          ? bgioArguments.G.bank.findAll(bgioArguments, argRule, context)
          : bgioArguments.G.bank.findOne(bgioArguments, argRule, context)
      } else if (argRule.type === 'RelativePath') {
        const target = bgioArguments.G.bank.findOne(bgioArguments, argRule.target, context)
        argument = get(target, argRule.path)
      } else {
        argument = argRule
      }
    }
    return {...acc, [argName]: argument}
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
  if (conditionRule.target.targetingType === 'RelativeCoordinates') {
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
  } else if (conditionRule.target.targetingType === 'Parent') {
    resolvedTarget = G.bank.findParent(originalTarget)
  } else if (conditionRule.target.contextPath) {
    resolvedTarget = get(context, conditionRule.target.contextPath)
  } else if (conditionRule.target.ctxPath) {
    // getting player list from playOrder, does this exist for custom turn order?
    resolvedTarget = get(bgioArguments.ctx, conditionRule.target.ctxPath)
  } else {
    resolvedTarget = G.bank.findOne(
      bgioArguments,
      conditionRule.target
    )
  }
  return resolvedTarget
}
