import React, { createContext, useContext, useReducer, useLayoutEffect } from 'react';

const GameContext = createContext({
  dispatch: () => {},
});

const clicksMap = {
  placePlayerMarker: [
    (moveRule, G) => G.bank.findAll(moveRule.destination)
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

export function GameProvider ({ G, moves, children, isSpectator }) {
  const initialState = { eliminatedMoves: [], stepIndex: 0, targets: [] }
  const [currentMoveState, disp] = useReducer((state, action) => {
    const { eliminatedMoves, stepIndex, targets } = state
    const { type: actionType, possibleMoveMeta } = action

    switch (actionType) {
      case 'click':
        const { target } = action
        const newEliminatedMoves = Object.entries(possibleMoveMeta)
          .reduce((acc, [moveName, { clickable, finishedOnLastStep }]) => {
            return !finishedOnLastStep && clickable.has(target)
              ? acc
              : [...acc, moveName]
          }, [...eliminatedMoves])
        if (newEliminatedMoves.length === Object.keys(moves).length) {
          console.error('invalid move with target of rule: ', target?.rule)
          return state
        } else {
          return { eliminatedMoves: newEliminatedMoves, stepIndex: stepIndex + 1, targets: [...targets, target] }
        }
      case 'clear':
        return initialState
    }

    return state
  }, initialState)

  const possibleMoveMeta = {}
  const allClickable = new Set()
  if (!isSpectator) {
    const possibleMoveRules = Object.entries(moves)
      .filter(([moveName]) => !currentMoveState.eliminatedMoves.includes(moveName))
      .map(([moveName, move]) => ({
        ...move.moveInstance.rule,
        steps: clicksMap[move.moveInstance.rule.type],
        moveName
      }))
    possibleMoveRules.forEach((moveRule) => {
      const moveSteps = clicksMap[moveRule.moveName]
      const lastStep = moveSteps?.[currentMoveState.stepIndex - 1]
      const currentStep = moveSteps?.[currentMoveState.stepIndex]
      const finishedOnLastStep = moveSteps && !!lastStep && !currentStep
      const clickable = new Set(currentStep?.(moveRule, G) || [])
      possibleMoveMeta[moveRule.moveName] = { finishedOnLastStep, clickable }
      clickable.forEach((entity) => { allClickable.add(entity) })
    })
  }
  console.log('currentMoveState', currentMoveState)

  const dispatch = (action) => { disp({ ...action, possibleMoveMeta }) }

  // useLayoutEffect clears move after we get into "last step complete"
  // state where nothing is clickable and before browser paint,
  // so we don't see a flash of temporary nonclickableness
  useLayoutEffect(() => {
    if (!isSpectator) {
      const possibleMoveNames = Object.keys(possibleMoveMeta)
      if (possibleMoveNames.length === 1) {
        const moveName = possibleMoveNames[0]
        if (possibleMoveMeta[moveName].finishedOnLastStep) {
          const move = moves[moveName]
          move(createPayload(moveName, currentMoveState.targets))
          dispatch({ type: 'clear' })
        }
      }
    }
  }, [currentMoveState.targets])

  console.log('allClickable', allClickable)

  return (
    <GameContext.Provider value={{ dispatch, allClickable }}>
      {children}
    </GameContext.Provider>
  );
}

function createPayload (moveName, targets) {
  switch (moveName) {
    case 'placePlayerMarker':
      return { entities: { destination: targets[0] } }
  }
}

export const useGame = () => useContext(GameContext);
