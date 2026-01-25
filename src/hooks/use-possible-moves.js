import { useMemo } from 'react';
import checkConditions from '../../server/game-factory/utils/check-conditions.js';
import getSteps from '../../server/game-factory/utils/get-steps.js';

export default function usePossibleMoves(gameConnection, moveBuilder, isSpectator) {
  return useMemo(() => {
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
      const moveRule = { ...move.moveInstance.rule, moveName };
      
      const context = { moveInstance: move.moveInstance }

      const moveIsAllowed = checkConditions(
        bgioState,
        moveRule,
        {},
        context
      ).conditionsAreMet;

      const moveSteps = getSteps(
        bgioState,
        moveRule,
        context
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
  }, [
    gameConnection.state,
    gameConnection.moves,
    moveBuilder.eliminatedMoves,
    moveBuilder.stepIndex,
    isSpectator
  ]);
}
