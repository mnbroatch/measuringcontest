import pick from "lodash/pick.js";
import get from "./get.js";

export default function resolveProperties (bgioArguments, obj, context) {
  let resolvedProperties = { ...obj }
  Object.entries(obj).forEach(([key, value]) => {
    if (key === 'player' && value === 'Current') {
      resolvedProperties.player = bgioArguments.ctx.currentPlayer
    } else if (value?.contextPath) {
      resolvedProperties[key] = get(context, value.contextPath)
    } else if (key === 'pick' && value?.target?.conditions) {
      const target = bgioArguments.G.bank.findOne(bgioArguments, value.target)
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
    }
  })
  return resolvedProperties
}
