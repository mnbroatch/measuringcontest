import React, { createContext, useContext, useEffect } from 'react';

const GameContext = createContext({
  clickTarget: () => {},
});

// do we need isSpectator
export function GameProvider({ gameConnection, children, isSpectator }) {
  useEffect(() => {
    if (gameConnection.state._stateID === 0) {
      gameConnection.reset()
    }
  }, [gameConnection.state._stateID]);

  return (
    <GameContext.Provider value={{
      clickTarget: target => gameConnection.doStep(target, isSpectator),
      undoStep: gameConnection.undoStep,
      allClickable: gameConnection.optimisticWinner
        ? new Set()
        : gameConnection.allClickable,
      currentMoveTargets: gameConnection.optimisticWinner
        ? []
        : gameConnection.moveBuilder.targets,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
