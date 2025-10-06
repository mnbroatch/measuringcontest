import React from 'react';
import Space from "../space/space.js";

export default function Grid ({ entity }) {
  const { rule, spaces } = entity;
  const { width, height, name } = rule;
  
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
            key={index}
            className="grid__cell"
            data-space-id={space.entityId}
            data-index={space.rule.index}
          >
            <Space space={space} />
          </div>
        );
      })}
    </div>
  );
}
