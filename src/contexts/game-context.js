import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext({
  dispatch: () => {},
});

const clicksMap = {
  placePlayerMarker: [
    (moveRule, G) => {
      console.log('moveRule.destination', moveRule.destination)
      const x = G.bank.findAll(moveRule.destination)
      return x
    }
  ]
}

function getClickable (moveRule, stepIndex, G) {
  return clicksMap[moveRule.type][stepIndex](moveRule, G)
}

function handleClick (action, state) {
  action.moveRules.filter(moveRule => checkMove(moveRule, action, state))
}

function checkMove (moveRule, action, state) {
  const checkFn = clicksMap[moveRule.type][state.completedSteps.length]
  return checkFn(moveRule, action)
}

export function GameProvider ({ G, moves, children }) {

  const [currentMoveState, disp] = useReducer((state, action) => {
    const { eliminatedMoves, stepIndex, targets } = state
    const { type: actionType, clickableByPossibleMove } = action

    switch (actionType) {
      case 'click':
        const { target } = action
        const newEliminatedMoves = Object.entries(clickableByPossibleMove)
          .reduce((acc, [moveName, { clickable, finishedOnThisStep }]) => {
            return !finishedOnThisStep && clickable.has(target)
              ? acc
              : [...acc, moveName]
          }, [...eliminatedMoves])
        if (newEliminatedMoves.length === Object.keys(moves).length) {
          console.error('invalid move with target of rule: ', target?.rule)
          return state
        } else {
          return { eliminatedMoves: newEliminatedMoves, stepIndex: stepIndex + 1, targets: [...targets, target] }
        }
    }

    return state
  }, { eliminatedMoves: [], stepIndex: 0, targets: [] })

  const possibleMoveRules = Object.entries(moves)
    .filter(([moveName]) => !currentMoveState.eliminatedMoves.includes(moveName))
    .map(([moveName, move]) => ({
      ...move.moveInstance.rule,
      steps: clicksMap[move.moveInstance.rule.type],
      moveName
    }))
  const clickableByPossibleMove = {}
  const allClickable = new Set()
  possibleMoveRules.forEach((moveRule) => {
    const moveSteps = clicksMap[moveRule.moveName]
    const lastStep = moveSteps?.[currentMoveState.stepIndex - 1]
    const currentStep = moveSteps?.[currentMoveState.stepIndex]
    const finishedOnThisStep = moveSteps && !!lastStep && !currentStep
    const clickable = new Set(currentStep?.(moveRule, G) || [])
    clickableByPossibleMove[moveRule.moveName] = { finishedOnThisStep, clickable }
    clickable.forEach((entity) => { allClickable.add(entity) })
  })

  const dispatch = (action) => { disp({ ...action, clickableByPossibleMove }) }

  useEffect(() => {
    console.log('targets', currentMoveState.targets)
  }, [currentMoveState.targets])

  return (
    <GameContext.Provider value={{ dispatch, allClickable }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
