import pick from "lodash/pick.js";
import get from "./get.js";

// should we merge state here?
export default function resolveProperties (bgioArguments, obj, context) {
  let resolvedProperties = { ...obj }
  Object.entries(obj).forEach(([key, value]) => {
    if (key === 'player' && value === 'Current') {
      resolvedProperties.player = bgioArguments.ctx.currentPlayer
    } else if (value?.contextPath) {
      resolvedProperties[key] = get(context, value.contextPath)
    } else if (key === 'pick' && value?.target?.conditions) {
      const target = bgioArguments.G.bank.findOne(bgioArguments, value.target)
      resolvedProperties = { ...resolvedProperties, ...pick(resolveProperties(bgioArguments, target.rule, context), value.properties) }
      delete resolvedProperties.pick
    }
  })
  return resolvedProperties
}
