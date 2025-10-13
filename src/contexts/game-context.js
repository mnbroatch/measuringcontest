import React, { createContext, useContext, useReducer, useLayoutEffect } from 'react';
import { serialize } from 'wackson'
import preparePayload from "../../server/game-factory/utils/prepare-payload.js";
import createPayload from "../../server/game-factory/utils/create-payload.js";
import simulateMove from "../../server/game-factory/utils/simulate-move.js";

const GameContext = createContext({
  dispatch: () => {},
});

// TODO: make this based on move type instead of move name, using automatic: true as a hint for which entities don't require a step
// maybe build partial payload instead of targets array and check with isValid or similar
const clicksMap = {
  placePlayerMarker: [
    (bgioState, moveRule, context) => {
      return bgioState.G.bank.findAll(bgioState, moveRule.arguments.destination, context)
    }
  ],
  placeDisc: [
    (bgioState, moveRule, context) => {
      return bgioState.G.bank.findAll(bgioState, moveRule.arguments.destination, context)
    }
  ]
}

export function GameProvider ({ gameConnection, children, isSpectator }) {
  const { state: bgioState, moves } = gameConnection

  const initialState = { eliminatedMoves: [], stepIndex: 0, targets: [], winnerAfterMove: undefined }
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
      case 'moveMade':
        // we simulate the end of the game so we can optimistically change UI, avoiding
        // flash of "available" (but not really) moves
        return {
          ...initialState,
          winnerAfterMove: getWinnerAfterMove(gameConnection, action.move.moveInstance, action.movePayload),
        }
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
        steps: clicksMap[move.moveInstance.rule.type], // is this unused?
        moveName
      }))
    possibleMoveRules.forEach((moveRule) => {
      const moveSteps = clicksMap[moveRule.moveName]
      const lastStep = moveSteps?.[currentMoveState.stepIndex - 1]
      const currentStep = moveSteps?.[currentMoveState.stepIndex]
      const finishedOnLastStep = moveSteps && !!lastStep && !currentStep
      const clickable = new Set(currentStep?.(
        bgioState,
        moveRule,
        { moveInstance: moves[moveRule.moveName].moveInstance }
      ) || [])
      possibleMoveMeta[moveRule.moveName] = { finishedOnLastStep, clickable }
      clickable.forEach((entity) => { allClickable.add(entity) })
    })
  }

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
          const movePayload = createPayload(moveName, currentMoveState.targets)
          move(movePayload)
          dispatch({ type: 'moveMade', movePayload, move })
        }
      }
    }
  }, [currentMoveState.targets])

  const allClickableToUse = currentMoveState.winnerAfterMove ? new Set() : allClickable
  const currentMoveTargetsToUse = currentMoveState.winnerAfterMove ? [] : currentMoveState.targets

  return (
    <GameContext.Provider value={{ dispatch, allClickable: allClickableToUse, currentMoveTargets: currentMoveTargetsToUse }}>
      {children}
    </GameContext.Provider>
  );
}

function getWinnerAfterMove (gameConnection, moveInstance, movePayload) {

  const { simulatedG } = simulateMove(
    gameConnection.state,
    preparePayload(movePayload),
    { moveInstance }
  )

  return gameConnection.game.endIf?.({
    ...gameConnection.state,
    G: JSON.parse(serialize(simulatedG))
  })
}

export const useGame = () => useContext(GameContext);
