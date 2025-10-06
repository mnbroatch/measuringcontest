import React, { createContext, useContext, useReducer, useCallback } from 'react';

const GameContext = createContext({
  dispatch: () => {},
});

const clicksMap = {
  PlaceEntity: [
    { }
  ]
}

function handleClick (action, state) {
  action.moves.filter(move => checkMove(move, action))
}

function checkMove (move, action) {
  action,
  move,
}

export function GameProvider ({ G, moves, children }) {
  let moveRules
  if (moves) {
    moveRules = Object.entries(moves).map(([moveName, move]) => ({
      ...move.moveInstance.rule,
      steps: clicksMap[move.moveInstance.rule.type],
      moveName
    }))
  }
  console.log('moveRules', moveRules)


  const [currentMove, disp] = useReducer((state, action) => {
    const { type: actionType, moves } = action
    switch (actionType) {
      case 'click':
        handleClick(action, state)
    }
  }, {})

  const dispatch = useCallback((action) => {
    disp({ ...action, moves })
  }, [moves, disp])


  return (
    <GameContext.Provider value={{ dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
