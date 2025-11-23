import Move from "./move.js";
import doMoves from '../utils/do-moves.js'

export default class SetActivePlayers extends Move {
  do(bgioArguments, rule, _, context) {
    bgioArguments.events.setActivePlayers(rule.options)

//     // limited to currentPlayer for now
//     const phaseName = bgioArguments.ctx.phase
//     const stageName = bgioArguments.ctx.activePlayers?.[bgioArguments.ctx.currentPlayer]
//     const phaseOrRoot = context.game.phases?.[phaseName] ?? context.game
//     const stage = phaseOrRoot?.turn?.stages?.[stageName]
//     console.log('----------')
//     console.log('stageName', stageName)
//     console.log('stage', stage)
//     console.log('stage.initialMoves', stage.initialMoves)

//     doMoves(bgioArguments, stage?.initialMoves, context)
  }
}
