import React, { createContext, useContext, useState, useLayoutEffect, useEffect } from 'react';
import { serialize } from 'wackson'
import simulateMove from "../../server/game-factory/utils/simulate-move.js";
import checkConditions from '../../server/game-factory/utils/check-conditions.js';
import getSteps from '../utils/get-steps.js';
import createPayload from '../utils/create-payload.js';
import preparePayload from "../utils/prepare-payload.js";
import resolveProperties from "../../server/game-factory/utils/resolve-properties.js";

const GameContext = createContext({
  clickTarget: () => {},
});

export function GameProvider({ gameConnection, children, isSpectator }) {
  const [moveBuilder, setMoveBuilder] = useState({
    targets: [],
    stepIndex: 0,
    eliminatedMoves: []
  });

  const [optimisticWinner, setOptimisticWinner] = useState(null);

  const { possibleMoveMeta, allClickable } = getPossibleMoves(
    gameConnection,
    moveBuilder,
    isSpectator
  )

  // Auto-execute when move is complete
  // layout effect so we don't flash "this has been selected" state on last click
  useLayoutEffect(() => {
    if (isSpectator || optimisticWinner) return;

    const completed = findCompletedMove(gameConnection.state, possibleMoveMeta, moveBuilder, gameConnection.moves);
    
    if (completed) {
      // Calculate optimistic winner
      const winner = getWinnerAfterMove(
        gameConnection,
        completed.move.moveInstance,
        completed.payload
      );
      
      // Execute the server action
      completed.move(completed.payload);
      
      // Update UI
      setOptimisticWinner(winner);
      setMoveBuilder({ targets: [], stepIndex: 0, eliminatedMoves: [] });
    }
  }, [moveBuilder.targets]);

  // Clear when game resets
  useEffect(() => {
    if (gameConnection.state._stateID === 0) {
      setMoveBuilder({ targets: [], stepIndex: 0, eliminatedMoves: [] });
      setOptimisticWinner(null);
    }
  }, [gameConnection.state._stateID]);

  const handleClick = (target) => {
    // Filter out moves that don't accept this target
    const newEliminated = Object.entries(possibleMoveMeta)
      .filter(([_, meta]) => !meta.finishedOnLastStep && !meta.clickableForMove.has(target))
      .map(([name]) => name)
      .concat(moveBuilder.eliminatedMoves);

    if (newEliminated.length === Object.keys(gameConnection.moves).length) {
      console.error('invalid move with target:', target?.rule);
      return;
    }

    setMoveBuilder({
      eliminatedMoves: newEliminated,
      stepIndex: moveBuilder.stepIndex + 1,
      targets: [...moveBuilder.targets, target]
    });
  };

  const undoStep = () => {
    if (moveBuilder.targets.length) {
      setMoveBuilder({
        targets: moveBuilder.targets.slice(0, -1),
        stepIndex: Math.max(0, moveBuilder.stepIndex - 1),
        eliminatedMoves: []
      })
    }
  }

  return (
    <GameContext.Provider value={{
      clickTarget: handleClick,
      undoStep,
      allClickable: optimisticWinner ? new Set() : allClickable,
      currentMoveTargets: optimisticWinner ? [] : moveBuilder.targets,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);

function getPossibleMoves(gameConnection, moveBuilder, isSpectator) {
  if (isSpectator) {
    return { possibleMoveMeta: {}, allClickable: new Set() };
  }

  const { state: bgioState, moves } = gameConnection;
  const { eliminatedMoves, stepIndex } = moveBuilder;
  
  const possibleMoveMeta = {};
  const allClickable = new Set();

  const availableMoves = Object.entries(moves)
    .filter(([moveName]) => !eliminatedMoves.includes(moveName));

  availableMoves.forEach(([moveName, move]) => {
    const moveRule = resolveProperties(
      bgioState,
      { ...move.moveInstance.rule, moveName }
    )

    const context = {
      moveInstance: move.moveInstance,
      moveArguments: moveRule.arguments
    }
    
    const payload = createPayload(
      bgioState,
      moveRule,
      moveBuilder.targets,
      context
    );
    
    context.moveArguments = {
      ...context.moveArguments,
      ...payload.arguments,
    }

    const moveIsAllowed = checkConditions(
      bgioState,
      moveRule,
      {},
      context
    ).conditionsAreMet;

    const moveSteps = getSteps(
      bgioState,
      moveRule
    );

    const lastStep = moveSteps?.[stepIndex - 1];
    const currentStep = moveSteps?.[stepIndex];
    const finishedOnLastStep = moveSteps && !!lastStep && !currentStep;
    
    const clickableForMove = new Set(
      (moveIsAllowed && currentStep?.getClickable(context)) || []
    );

    possibleMoveMeta[moveName] = { finishedOnLastStep, clickableForMove };
    
    clickableForMove.forEach((entity) => {
      allClickable.add(entity);
    });
  });

  return { possibleMoveMeta, allClickable };
}

function findCompletedMove(bgioArguments, possibleMoveMeta, moveBuilder, moves) {
  const possibleMoveNames = Object.keys(possibleMoveMeta);
  
  // Only one possible move left
  if (possibleMoveNames.length !== 1) return null;
  
  const moveName = possibleMoveNames[0];
  const meta = possibleMoveMeta[moveName];
  
  // And it's finished
  if (!meta.finishedOnLastStep) return null;
  
  const move = moves[moveName];
  const moveRule = move.moveInstance.rule;
  
  const payload = createPayload(
    bgioArguments,
    moveRule,
    moveBuilder.targets,
    { moveInstance: move.moveInstance }
  );

  return { moveName, move, payload };
}

function getWinnerAfterMove (gameConnection, moveInstance, movePayload) {
  const simulatedG = simulateMove(
    gameConnection.state,
    preparePayload(movePayload),
    { moveInstance }
  )

  return gameConnection.game.endIf?.({
    ...gameConnection.state,
    G: JSON.parse(serialize(simulatedG))
  })
}
