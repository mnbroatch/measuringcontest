import React from 'react';
import { useGame } from "../../contexts/game-context.js";

export default function Grid ({ space }) {
  const { dispatch } = useGame()
  
  return (
    <a onClick={}>
      {space.entities.length > 0 && (
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>
          {space.entities.length} piece{space.entities.length !== 1 ? 's' : ''}
        </div>
      )}
    </a>
  );
}
