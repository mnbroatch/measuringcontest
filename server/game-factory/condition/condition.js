export default class Condition {
  constructor (rule) {
    this.rule = rule;
  }
  
  check (bgioArguments, payload = {}, context) {
    const { G } = bgioArguments
    const conditionPayload = {...payload}

    // override specific rules with different targets
    // aka "can place here if this other space is not empty"
    // this will probably grow messy and want to be refactored
    if (this.rule.target) {
      if (conditionPayload.target) {
        conditionPayload.originalTarget = conditionPayload.target
      }
      if (this.rule.target.targetingType === 'Relative') {
        let parent = G.bank.findParent(conditionPayload.target)
        // // we always want the SpaceGroup, whether target is Space or Entity
        // while (parent.rule.type !== 'Grid') {
        //   parent = G.bank.findParent(parent)
        //   if (!parent) {
        //     throw new Error(`couldnt find Grid parent of entity with rule ${conditionPayload.target.rule}`)
        //   }
        // }
        const oldCoordinates =
          parent.getCoordinates(conditionPayload.target.rule.index)
        const newCoordinates =
          parent.getRelativeCoordinates(oldCoordinates, this.rule.target.location)
        conditionPayload.target =
          newCoordinates && parent.spaces[parent.getIndex(newCoordinates)]
      } else {
        conditionPayload.target = G.bank.findOne(
          bgioArguments,
          this.rule.target
        )
      }
    }
    if (this.rule.targets) {
      if (conditionPayload.targets) {
        conditionPayload.originalTargets = conditionPayload.targets
      }
      conditionPayload.targets = this.rule.targets.reduce((acc, target) => [
        ...acc,
        ...G.bank.findAll(bgioArguments, target)
      ], [])
    }


    // I don't love having this exception here; will we need more?
    // Need a better system for move args => condition target in general
    if (this.rule.type !== 'Evaluate') {
      // nonexistent relative spaces for instance fulfill no conditions ever
      if (!conditionPayload.target && !conditionPayload.targets?.length) {
        return { conditionIsMet: false }
      }
    }

    return this.checkCondition(bgioArguments, conditionPayload, context)
  }

  isMet(...args) {
    return this.check(...args).conditionIsMet
  }
}
