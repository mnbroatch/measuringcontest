// import React, { createContext, useContext, useReducer, useLayoutEffect, useRef } from 'react';

// const GameContext = createContext({
//   dispatch: () => {},
// });

// const clicksMap = {
//   placePlayerMarker: [
//     (moveRule, bgioState) => bgioState.G.bank.findAll(moveRule.destination, bgioState),
//   ]
// }

// export function GameProvider ({ gameConnection, children, isSpectator }) {
//   const { state: bgioState, moves } = gameConnection
//   const initialState = { eliminatedMoves: [], stepIndex: 0, targets: [] }
//   const [currentMoveState, disp] = useReducer((state, action) => {
//     const { eliminatedMoves, stepIndex, targets } = state
//     const { type: actionType, possibleMoveMeta } = action
//     switch (actionType) {
//       case 'click':
//         const { target } = action
//         const newEliminatedMoves = Object.entries(possibleMoveMeta)
//           .reduce((acc, [moveName, { clickable, finishedOnLastStep }]) => {
//             return !finishedOnLastStep && clickable.has(target)
//               ? acc
//               : [...acc, moveName]
//           }, [...eliminatedMoves])
//         if (newEliminatedMoves.length === Object.keys(moves).length) {
//           console.error('invalid move with target of rule: ', target?.rule)
//           return state
//         } else {
//           return { eliminatedMoves: newEliminatedMoves, stepIndex: stepIndex + 1, targets: [...targets, target] }
//         }
//       case 'clear':
//         return initialState
//     }
//     return state
//   }, initialState)
  
//   // Track whether we're waiting for server response or processing a click
//   const pendingServerMove = useRef(false)
//   const processingClick = useRef(false)
//   const frozenClickable = useRef(new Set())
  
//   const possibleMoveMeta = {}
//   const allClickable = new Set()
  
//   if (!isSpectator) {
//     const possibleMoveRules = Object.entries(moves)
//       .filter(([moveName]) => !currentMoveState.eliminatedMoves.includes(moveName))
//       .map(([moveName, move]) => ({
//         ...move.moveInstance.rule,
//         steps: clicksMap[move.moveInstance.rule.type],
//         moveName
//       }))
//     possibleMoveRules.forEach((moveRule) => {
//       const moveSteps = clicksMap[moveRule.moveName]
//       const lastStep = moveSteps?.[currentMoveState.stepIndex - 1]
//       const currentStep = moveSteps?.[currentMoveState.stepIndex]
//       const finishedOnLastStep = moveSteps && !!lastStep && !currentStep
//       const clickable = new Set(currentStep?.(moveRule, bgioState) || [])
//       possibleMoveMeta[moveRule.moveName] = { finishedOnLastStep, clickable }
//       clickable.forEach((entity) => { allClickable.add(entity) })
//     })
//   }
  
//   const possibleMoveNames = Object.keys(possibleMoveMeta)
//   const firstMoveName = possibleMoveNames[0]
//   const finishedOnLastStep = possibleMoveNames.length === 1 && possibleMoveMeta[firstMoveName]?.finishedOnLastStep
  
//   // Use frozen clickable if we're waiting for server or processing a click
//   const clickableToUse = (pendingServerMove.current || processingClick.current) 
//     ? frozenClickable.current 
//     : allClickable
  
//   const dispatch = (action) => {
//     if (action.type === 'click') {
//       // Freeze clickable state before processing click
//       frozenClickable.current = new Set(allClickable)
//       processingClick.current = true
//     }
//     disp({ ...action, possibleMoveMeta })
//   }
  
//   // useLayoutEffect clears move after we get into "last step complete"
//   // state where nothing is clickable and before browser paint,
//   // so we don't see a flash of temporary nonclickableness
//   useLayoutEffect(() => {
//     if (finishedOnLastStep) {
//       // Keep frozen state, mark as pending server response
//       pendingServerMove.current = true
//       processingClick.current = false
      
//       const move = moves[firstMoveName]
//       move(createPayload(firstMoveName, currentMoveState.targets))
//       dispatch({ type: 'clear' })
//     } else if (processingClick.current) {
//       // Click processed, update frozen state to new clickable
//       frozenClickable.current = new Set(allClickable)
//       processingClick.current = false
//     }
//   }, [finishedOnLastStep, currentMoveState.stepIndex])
  
//   // Reset pending flag when bgioState changes (server responded)
//   useLayoutEffect(() => {
//     if (pendingServerMove.current) {
//       pendingServerMove.current = false
//     }
//   }, [bgioState])
  
//   return (
//     <GameContext.Provider value={{ dispatch, allClickable: clickableToUse, currentMoveTargets: currentMoveState.targets }}>
//       {children}
//     </GameContext.Provider>
//   );
// }

// function createPayload (moveName, targets) {
//   switch (moveName) {
//     case 'placePlayerMarker':
//       return { entities: { destination: targets[0] } }
//   }
// }

// export const useGame = () => useContext(GameContext);


import React, { createContext, useContext, useReducer, useLayoutEffect, useRef } from 'react';

const GameContext = createContext({
  dispatch: () => {},
});

const clicksMap = {
  placePlayerMarker: [
    (moveRule, bgioState) => bgioState.G.bank.findAll(moveRule.destination, bgioState),
  ]
}

export function GameProvider ({ gameConnection, children, isSpectator }) {
  const { state: bgioState, moves } = gameConnection
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
      default:
        return state
    }
  }, initialState)
  
  // Track whether we're waiting for server response
  const waitingForServer = useRef(false)
  const frozenClickable = useRef(new Set())
  
  const possibleMoveMeta = {}
  const allClickable = new Set()
  
  if (!isSpectator) {
    const possibleMoveRules = Object.entries(moves)
      .filter(([moveName]) => !currentMoveState.eliminatedMoves.includes(moveName))
      .map(([moveName, move]) => ({
        ...move.moveInstance.rule,
        steps: clicksMap[moveName],
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
  
  const possibleMoveNames = Object.keys(possibleMoveMeta)
  const firstMoveName = possibleMoveNames[0]
  const finishedOnLastStep = possibleMoveNames.length === 1 && possibleMoveMeta[firstMoveName]?.finishedOnLastStep
  
  // Use frozen clickable if we're waiting for server AND current clickable is empty
  const shouldUseFrozen = waitingForServer.current && allClickable.size === 0
  const clickableToUse = shouldUseFrozen ? frozenClickable.current : allClickable
  
  // If we have new clickable items, clear the waiting flag
  if (waitingForServer.current && allClickable.size > 0) {
    waitingForServer.current = false
  }
  
  const dispatch = (action) => {
    if (action.type === 'click') {
      // Freeze clickable state before processing click
      frozenClickable.current = new Set(allClickable)
    }
    disp({ ...action, possibleMoveMeta })
  }
  
  // Auto-execute move when finished
  useLayoutEffect(() => {
    if (finishedOnLastStep) {
      // Mark as waiting for server
      waitingForServer.current = true
      
      const move = moves[firstMoveName]
      move(createPayload(firstMoveName, currentMoveState.targets))
      dispatch({ type: 'clear' })
    }
  }, [finishedOnLastStep, currentMoveState.stepIndex])
  
  return (
    <GameContext.Provider value={{ dispatch, allClickable: clickableToUse, currentMoveTargets: currentMoveState.targets }}>
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
