import React from 'react'
import Entity from '../entity/entity.js'
import connectFour from "../../../server/connect-four.json";
import conditionFactory from "../../../server/game-factory/condition/condition-factory.js";

export default function Game ({ bgioState }) {
  const { G } = bgioState

  // console.log('getMatchingWinConditionResult(bgioArguments, rules.endIf)', getMatchingWinConditionResult(bgioState, connectFour.endIf))

  return (
    <>
      <div className="shared-board">
        {G.sharedBoard.map((entity, i) => <Entity key={i} entity={entity} />)}
      </div>
    </>
  )
}

function getMatchingWinConditionResult(bgioArguments, winConditions) {
  for (const winCondition of winConditions) {
    const conditionResults = [];

    for (const cond of winCondition.conditions) {
      const conditionResult = conditionFactory(cond).check(bgioArguments);

      if (conditionResult.conditionIsMet) {
        conditionResults.push(conditionResult);
      } else {
        break;
      }
    }

    if (conditionResults.length === winCondition.conditions.length) {
      return { winCondition, conditionResults };
    }
  }

  return null;
}
