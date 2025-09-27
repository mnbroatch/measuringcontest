import Action from "./action.js";
import resolveEntity from "../resolve-entity.js";

export default class PlaceEntity extends Move {
  constructor (moveRule) {
    super (moveRule)
  }
  do(G, ctx, { destination }) {
    const entityRuleCopy = {...entityRule}
    if (entityRuleCopy.player === 'current') {
      entityRuleCopy.player = ctx.currentPlayer
    }
    destination.placeEntity(G.bank.getOne(entityRuleCopy))
  }
}
