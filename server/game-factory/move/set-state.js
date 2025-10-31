import Move from "./move.js";

// todo: invariant conditions like "is one of the allowed values"
export default class SetState extends Move {
  do(_, { arguments: { entity, state } }) {
    entity.state = {
      ...entity.state,
      [state.property]: state.value,
    }
  }
}
