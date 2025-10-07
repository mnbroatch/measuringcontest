import React, { createContext, useContext, useReducer, useCallback } from 'react';

const GameContext = createContext({
  dispatch: () => {},
});

const stepsMap = {
  PlaceEntity: [
    (moveRule, action) => {
      console.log('moveRule, action', moveRule, action)
    }
  ]
}

function handleClick (action, state) {
  action.moveRules.filter(moveRule => checkMove(moveRule, action, state))
}

function checkMove (moveRule, action, state) {
  const checkFn = stepsMap[moveRule.type][state.completedSteps.length]
  return checkFn(moveRule, action)
}

export function GameProvider ({ G, moves, children }) {

  const [currentMove, disp] = useReducer((state, action) => {
    const { type: actionType, moves, moveRules } = action
    switch (actionType) {
      case 'step':
        handleClick(action, state)
    }
    return state
  }, { clickable: [], completedSteps: [] })

  const dispatch = useCallback((action) => {
    let moveRules
    if (moves) {
      moveRules = Object.entries(moves).map(([moveName, move]) => ({
        ...move.moveInstance.rule,
        steps: stepsMap[move.moveInstance.rule.type],
        moveName
      }))
    }

    const clickable = new Set()
    G.bank.tracker.forEach((entity) => {
      moveRules.some(moveRule => 
    })

    disp({ ...action, moves, moveRules, clickable })
  }, [moves, disp, G])







  return (
    <GameContext.Provider value={{ dispatch, currentMove }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
