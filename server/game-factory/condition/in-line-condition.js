import _matches from "lodash/matches.js";
import Condition from "../condition/condition.js";

const relativeCoordinates = [[1, 0], [1, 1], [0, 1], [-1, 1]];
export default class InLineCondition extends Condition {
  checkCondition(bgioArguments, payload) {
    const { target } = payload
    let parent = G.bank.findParent(conditionPayload.target)
    for (let i = 0; i < relativeCoordinates.length; i++) {
      const relativeCoordinate = relativeCoordinates[i]





    }
  }
}

function checkSequence(nextSpace, sequencePattern) {
  // Try to match each chunk in the pattern
  for (const chunk of sequencePattern) {
    const { count = 1, conditions } = chunk;
    let matchedCount = 0;
    
    // Try to match 'count' consecutive spaces for this chunk
    while (matchedCount < count) {
      const space = nextSpace();
      
      // Reached end of sequence
      if (space === null || space === undefined) {
        return false;
      }
      
      // Check if this space matches all conditions for this chunk
      if (checkConditions(space, conditions)) {
        matchedCount++;
      } else {
        // Space doesn't match - sequence fails
        return false;
      }
    }
  }
  
  // All chunks matched successfully
  return true;
}

function checkConditions(space, conditions) {
  return conditions.every(condition => {
    switch (condition.type) {
      case 'contains':
        return space.entities.some(entity => 
          matchesMatcher(entity, condition.matcher)
        );
      // ... other condition types
      default:
        return false;
    }
  });
}

function matchesMatcher(entity, matcher) {
  return Object.entries(matcher).every(([key, value]) => {
    return entity[key] === value;
  });
}
