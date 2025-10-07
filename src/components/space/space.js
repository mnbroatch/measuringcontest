import React from 'react';
import { useGame } from "../../contexts/game-context.js";
import Entity from '../entity/entity.js'

export default function Space ({ space }) {
  const { dispatch } = useGame()
  
  return (
    <a className="space" onClick={() => dispatch({ type: 'click', target: space })}>
      {space.entities.map((entity, i) => <Entity key={i} entity={entity} />)}
    </a>
  );
}
