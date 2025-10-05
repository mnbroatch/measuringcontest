import React from 'react';
import { useGame } from "../../contexts/game-context.js";

export default function Grid ({ entity }) {
  const { rule, spaces } = entity;
  const { width, height, name } = rule;
  const { dispatch } = useGame()
  
  return (
    <div
      className="grid"
      style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gridTemplateRows: `repeat(${height}, 1fr)`,
      }}
    >
      {spaces.map((space, index) => {
        const row = Math.floor(index / width);
        const col = index % width;
        
        return (
          <div
            key={space.entityId}
            className="grid__cell"
            data-space-id={space.entityId}
            data-index={space.rule.index}
          >
            <div style={{ fontSize: '10px', opacity: 0.5 }}>
              ({row},{col})
            </div>
            {space.entities.length > 0 && (
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>
                {space.entities.length} piece{space.entities.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
