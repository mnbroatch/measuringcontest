import React from 'react'
import Entity from '../entity/entity.js'
import AbstractChoices from '../abstract-choices.js'

export default function Game ({ bgioState }) {
  const { G } = bgioState

  return (
    <>
      <div className="shared-board">
        {G.sharedBoard.entities.map((entity, i) => <Entity key={i} entity={entity} />)}
      </div>
      {G.personalBoards && (
        <div className="personal-boards">
          {G.personalBoards.map((board, i) => (
            <div key={i} className="personal-board">
              {board.entities.map((entity, j) => (
                <Entity key={j} entity={entity} />
              ))}
            </div>
          ))}
        </div>
      )}
      <AbstractChoices />
    </>
  )
}

import conditionFactory from "../../../server/game-factory/condition/condition-factory.js";
import connectFour from "../../../server/connect-four.json";
// console.log('getMatchingWinConditionResult(bgioArguments, rules.endIf)', getMatchingWinConditionResult(bgioState, connectFour.endIf))
// function getMatchingWinConditionResult(bgioArguments, winConditions) {
//   for (const winCondition of winConditions) {
//     const conditionResults = [];

//     for (const cond of winCondition.conditions) {
//       const conditionResult = conditionFactory(cond).check(bgioArguments);

//       if (conditionResult.conditionIsMet) {
//         conditionResults.push(conditionResult);
//       } else {
//         break;
//       }
//     }

//     if (conditionResults.length === winCondition.conditions.length) {
//       return { winCondition, conditionResults };
//     }
//   }

//   return null;
// }
