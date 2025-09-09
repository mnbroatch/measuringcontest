const { InMemory } = require('boardgame.io/server');

class StrictInMemory extends InMemory {
  async fetch(matchID, opts) {
    if (!this.metadata.has(matchID)) {
      throw new Error(`Match ${matchID} does not exist`);
    }

    const result = {};
    if (opts.state) result.state = this.state.get(matchID);
    if (opts.log) result.log = this.log.get(matchID) || [];
    if (opts.metadata) result.metadata = this.metadata.get(matchID);
    if (opts.initialState) result.initialState = this.initial.get(matchID);

    return result;
  }
}

module.exports = StrictInMemory;
