// get the most specific set of moves for current stage/phase
// todo: investigate - game.moves is undefined when starting new game after existing game in editor?
export default function getCurrentMoves (game, state, playerID) {
  const phaseName = state.ctx.phase

  // currentPlayer used for single player editor mode
  const stageName = state.ctx.activePlayers?.[playerID ?? state.ctx.currentPlayer]

  const phaseOrRoot = game.phases?.[phaseName] ?? game
  const stageOrPhaseOrRoot = phaseOrRoot.turn?.stages?.[stageName] ?? phaseOrRoot

  return stageOrPhaseOrRoot.moves
}
