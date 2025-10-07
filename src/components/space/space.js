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
  const { dispatch, allClickable } = useGame()

  const columns = calculateOptimalCols(space.entities.length)


  return (
    <a
      className={[
        'space',
        allClickable.has(space) && 'space--clickable'
      ].filter(Boolean).join(' ')}
      onClick={() => dispatch({ type: 'click', target: space })}
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
          {Array.from({ length: space.entities.length }, (_, i) => (
            <div
              className="space__entity-grid__cell"
              style={{
                width: '100%',
                height: '100%',
              }}
              key={i}
            >
              <Entity entity={space.entities[i]} />
            </div>
          ))}
        </div>
    </a>
  );
}
