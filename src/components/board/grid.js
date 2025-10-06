import React from 'react';
import Entity from "../entity/entity.js";

export default function Grid ({ grid }) {
  const { rule, spaces } = grid;
  const { width, height } = rule;
  
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
        return (
          <div
            key={index}
            className="grid__cell"
          >
            <Entity entity={space} />
          </div>
        );
      })}
    </div>
  );
}
