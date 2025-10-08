import React, { createContext, useContext, useReducer, useLayoutEffect } from 'react';
import { preparePayload } from "../hooks/use-game-connection.js";

const GameContext = createContext({
  dispatch: () => {},
});

const clicksMap = {
  placePlayerMarker: [
    (moveRule, bgioState) => bgioState.G.bank.findAll(moveRule.destination, bgioState)
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
          winnerAfterMove: getWinnerAfterMove(gameConnection, action.move, action.movePayload),
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
        steps: clicksMap[move.moveInstance.rule.type],
        moveName
      }))
    possibleMoveRules.forEach((moveRule) => {
      const moveSteps = clicksMap[moveRule.moveName]
      const lastStep = moveSteps?.[currentMoveState.stepIndex - 1]
      const currentStep = moveSteps?.[currentMoveState.stepIndex]
      const finishedOnLastStep = moveSteps && !!lastStep && !currentStep
      const clickable = new Set(currentStep?.(moveRule, bgioState) || [])
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

function createPayload (moveName, targets) {
  switch (moveName) {
    case 'placePlayerMarker':
      return { entities: { destination: targets[0] } }
  }
}

function getWinnerAfterMove (gameConnection, move, movePayload) {
  const originalGState = {
    ...gameConnection.state,
    G: gameConnection.state.originalG
  }

  const pureMove = move.moveInstance.createBoardgameIOCompatibleMove()
  const newG = pureMove(originalGState, preparePayload(movePayload))

  return gameConnection.game.endIf({
    ...gameConnection.state,
    G: newG
  })
}

export const useGame = () => useContext(GameContext);
