// get the most specific set of moves for current stage/phase
// this will probably all break for complex stages with multiple active players
export default function getCurrentMoves (game, state, playerID) {
  const phaseName = state.ctx.phase

  // currentPlayer used for single player editor mode
  const stageName = state.ctx.activePlayers?.[playerID ?? state.ctx.currentPlayer]

  const phaseOrRoot = game.phases?.[phaseName] ?? game
  const stageOrPhaseOrRoot = phaseOrRoot.turn?.stages?.[stageName] ?? phaseOrRoot

  return stageOrPhaseOrRoot.moves ?? {}
}
