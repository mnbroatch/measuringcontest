import React from 'react';
import { useGame } from "../../contexts/game-context.js";
import Entity from '../entity/entity.js'

function calculateOptimalCols(numSquares) {
  if (numSquares === 0) return 1;
  
  let bestCols = 1;
  let bestAspectRatio = Infinity;
  
  for (let cols = 1; cols <= numSquares; cols++) {
    const rows = Math.ceil(numSquares / cols);
    const aspectRatio = Math.abs(cols - rows);
    
    if (aspectRatio < bestAspectRatio) {
      bestAspectRatio = aspectRatio;
      bestCols = cols;
    }
  }
  
  return bestCols;
}

export default function Space ({ space }) {
  const { clickTarget, allClickable, currentMoveTargets } = useGame()
  const { entities, entityId } = space.attributes

  const columns = calculateOptimalCols(entities.length)

  const clickable = [...allClickable].map(e => e.entityId).includes(entityId)
  const targeted = currentMoveTargets?.map(e => e.entityId).includes(entityId)

  return (
    <a
      className={[
        'space',
        clickable && 'space--clickable',
        targeted && 'space--targeted'
      ].filter(Boolean).join(' ')}
      onClick={() => clickTarget(space)}
    >
       <div 
          className="space__entity-grid"
          style={{
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridAutoRows: '1fr',
            placeItems: 'center',
          }}
        >
          {Array.from({ length: entities.length }, (_, i) => (
            <div
              className="space__entity-grid__cell"
              style={{
                width: '100%',
                height: '100%',
              }}
              key={i}
            >
              <Entity entity={entities[i]} />
            </div>
          ))}
          {!entities.length && space.attributes.name}
        </div>
    </a>
  );
}
