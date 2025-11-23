import { deserialize } from "wackson";
import { registry } from "../registry.js";
import moveFactory from "../move/move-factory.js";

export default function doMoves (bgioArguments, moves = [], context) {
  if (!moves?.length) {
    return bgioArguments.G
  }

  // todo: can we get rid of this ugliness? can't detect proxy...
  let newG = bgioArguments.G
  try {
    newG = deserialize(JSON.stringify(bgioArguments.G), registry)
  } catch (e) {
    // G was already deserialized
  }

  moves.forEach((moveRule) => {
    moveFactory(moveRule, context.game).moveInstance.doMove(
      { ...bgioArguments, G: newG },
      undefined,
      context
    );
  })

  return newG
}

