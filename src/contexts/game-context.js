import React, { createContext, useContext, useReducer } from 'react';

const GameContext = createContext({
  dispatch: async () => {},
});

const stepsMap = {
  PlaceEntity: [
    {
      type: "ClickSpace",

    }
  ]
}

export function GameProvider ({ moves, children }) {
  let moveRules
  if (moves) {
    moveRules = Object.entries(moves).map(([moveName, move]) => ({
      ...move.moveInstance.rule,
      steps: stepsMap[move.moveInstance.rule.type],
      moveName
    }))
  }
  console.log('moveRules', moveRules)


  const [currentMove, dispatch] = useReducer((state, action) => {
    
  }, {})


  return (
    <GameContext.Provider value={{ dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
