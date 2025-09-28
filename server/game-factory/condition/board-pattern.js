import Condition from "../condition/condition.js";

export default class BoardPattern extends Condition {
  isMet(bgioArguments, payload) {
    const { G } = bgioArguments
    const boards = G.bank.findAll(payload)
    return boards.some(board => {
      checkBoard(bgioArguments, board)
    })
  }

  checkBoard () {}

  checkSpace (bgioArguments, space, spaceConditionRules) {
    const spaceConditionMappings = rule.destination.conditions.map(rule => ({
      rule,
      mappings: { target: payload => payload.entities.destination }
    }))
    return spaceConditions.every(
  }
}
