import Move from "./move.js";

export default class Shuffle extends Move {
  do(bgioArguments, { arguments: { target } }) {
    shuffle(bgioArguments, target)
  }
}

function shuffle (bgioArguments, target) {
  for (let i = target.entities.length - 1; i > 0; i--) {
    const j = Math.floor(bgioArguments.random.Number() * (i + 1));
    [target.entities[i], target.entities[j]] = [target.entities[j], target.entities[i]];
  }
}
