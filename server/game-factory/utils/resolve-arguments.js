import get from "./get.js";

// todo: change to resolve one arguments at a time? probably 2 composed fns
export default function resolveArguments (
  bgioArguments,
  moveRule,
  payload,
  context
) {
  return Object.entries(moveRule.arguments ?? {}).reduce((acc, [argName, argRule]) => {
    console.log(bgioArguments)
    let argument = payload?.arguments?.[argName]
    if (!argument) {
      if (!argRule.automatic) {
        console.error(`non-automatic move rule didn't get argument: ${argName} in ${JSON.stringify(moveRule)}`)
      }
      if (argRule.location === 'Bank') {
        argument = argRule.matchMultiple
          ? bgioArguments.G.bank.getMultiple(bgioArguments, argRule)
          : bgioArguments.G.bank.getOne(bgioArguments, argRule)
      } else if (argRule.contextPath) {
        argument = get(context, argRule.contextPath)
      } else if (argRule.ctxPath) {
        // getting player list from playOrder, does this exist for custom turn order?
        argument = get(bgioArguments.ctx, argRule.contextPath)
      } else if (argRule.gamePath) {
        argument = get(bgioArguments.G, argRule.gamePath)
      } else {
        argument = bgioArguments.G.bank.findOne(bgioArguments, argRule, context)
        argument = argRule.matchMultiple
          ? bgioArguments.G.bank.findAll(bgioArguments, argRule, context)
          : bgioArguments.G.bank.findOne(bgioArguments, argRule, context)
      }
    }
    return {...acc, [argName]: argument}
  }, {})
}
