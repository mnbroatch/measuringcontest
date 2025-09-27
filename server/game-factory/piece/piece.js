export default class Piece {
  constructor(pieceRule, options) {
    this.rule = pieceRule;
    this.id = `${Math.random()}`
    if (options.player !== undefined) {
      ({ player: this.player } = options);
    }
  }

  doesRuleMatch(matcher) {
    if (matcher.player !== undefined) {
      return matcher.player === this.player;
    }
    return true;
  }
}
