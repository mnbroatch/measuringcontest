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
  action.moveRules.filter(move => checkMove(move, action))
}

function checkMove (move, action) {
}

export function GameProvider ({ G, moves, children }) {

  const [currentMove, disp] = useReducer((state, action) => {
    const { type: actionType, moves, moveRules } = action
    console.log('moves', moves)
    console.log('moveRules', moveRules)
    switch (actionType) {
      case 'click':
        handleClick(action, state)
    }
    return state
  }, { clickable: [] })

  const dispatch = useCallback((action) => {
    let moveRules
    if (moves) {
      moveRules = Object.entries(moves).map(([moveName, move]) => ({
        ...move.moveInstance.rule,
        steps: clicksMap[move.moveInstance.rule.type],
        moveName
      }))
    }

    disp({ ...action, moves, moveRules })
  }, [moves, disp])


  return (
    <GameContext.Provider value={{ dispatch, currentMove }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
