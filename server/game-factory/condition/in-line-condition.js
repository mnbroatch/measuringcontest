import _matches from "lodash/matches.js";
import Condition from "./condition.js";
import checkConditions from "../utils/check-conditions.js";

const directions = [[1, 0], [1, 1], [0, 1], [-1, 1]];

export default class InLineCondition extends Condition {
  checkCondition(bgioArguments, payload) {
    const { G } = bgioArguments;
    const { target } = payload;
    console.log('target', target)
    const parent = G.bank.findParent(payload.target);
    
    // Find all sequences in the grid
    const { matches: allMatches } = gridContainsSequence(bgioArguments, parent, this.rule.sequence);
    
    // Filter to only sequences that contain the target space
    const matches = allMatches.filter(sequence => 
      sequence.some(space => space === target)
    );

    return { matches, conditionIsMet: !!matches.length };
  }
}

// Shared function for finding all sequences in a grid
export function gridContainsSequence(bgioArguments, grid, sequencePattern) {
  const matches = [];
  const sequenceLength = sequencePattern.reduce((sum, chunk) => sum + (chunk.count || 1), 0);
  
  // For each direction, scan each row/column/diagonal once
  for (const [dx, dy] of directions) {
    const lines = getLineStartingPoints(grid, dx, dy);
    
    for (const [startX, startY] of lines) {
      const lineSpaces = getLineSpaces(grid, startX, startY, dx, dy);
      const lineMatches = findSequencesInLine(bgioArguments, lineSpaces, sequencePattern);
      matches.push(...lineMatches);
    }
  }
  return { matches, conditionIsMet: !!matches.length };
}

function getLineStartingPoints(grid, dx, dy) {
  const { width, height } = grid.attributes;
  const starts = [];
  
  if (dx === 1 && dy === 0) {
    // Horizontal: start at leftmost column
    for (let y = 0; y < height; y++) starts.push([0, y]);
  } else if (dx === 0 && dy === 1) {
    // Vertical: start at top row
    for (let x = 0; x < width; x++) starts.push([x, 0]);
  } else if (dx === 1 && dy === 1) {
    // Diagonal ?: start from top row and left column
    for (let x = 0; x < width; x++) starts.push([x, 0]);
    for (let y = 1; y < height; y++) starts.push([0, y]);
  } else if (dx === -1 && dy === 1) {
    // Diagonal ?: start from top row and right column
    for (let x = 0; x < width; x++) starts.push([x, 0]);
    for (let y = 1; y < height; y++) starts.push([width - 1, y]);
  }
  
  return starts;
}

function getLineSpaces(grid, startX, startY, dx, dy) {
  const spaces = [];
  let [x, y] = [startX, startY];
  
  while (grid.areCoordinatesValid([x, y])) {
    spaces.push(grid.getSpace([x, y]));
    x += dx;
    y += dy;
  }
  return spaces;
}

function findSequencesInLine(bgioArguments, lineSpaces, sequencePattern) {
  const matches = [];
  const minSequenceLength = sequencePattern.reduce((sum, chunk) => 
    sum + (chunk.minCount || chunk.count || 1), 0
  );
  
  let startIndex = 0;
  
  while (startIndex <= lineSpaces.length - minSequenceLength) {
    const matchedSpaces = tryMatchSequence(bgioArguments, lineSpaces, startIndex, sequencePattern);
    
    if (matchedSpaces) {
      matches.push(matchedSpaces);
      startIndex++; // Changed from startIndex += matchedSpaces.length
    } else {
      startIndex++;
    }
  }
  
  return matches;
}

function tryMatchSequence(bgioArguments, lineSpaces, startIndex, sequencePattern) {
  let spaceIndex = startIndex;
  const matchedSpaces = [];
  
  for (const chunk of sequencePattern) {
    const { count, minCount, maxCount, conditions } = chunk;
    
    let min, max;
    if (count !== undefined) {
      min = max = count;
    } else if (minCount !== undefined || maxCount !== undefined) {
      min = minCount || 0;
      max = maxCount || Infinity;
    } else {
      min = max = 1;
    }
    
    let matchedCount = 0;
    const chunkMatches = [];
    
    // Greedy: try to match as many as possible up to max
    while (matchedCount < max && spaceIndex < lineSpaces.length) {
      const space = lineSpaces[spaceIndex];
      
      // Pass all previously matched spaces in this chunk
      if (checkSpaceConditions(bgioArguments, space, conditions, chunkMatches)) {
        chunkMatches.push(space);
        matchedCount++;
        spaceIndex++;
      } else {
        break;
      }
    }
    
    // Check if we met the minimum requirement
    if (matchedCount < min) {
      return null;
    }
    
    matchedSpaces.push(...chunkMatches);
  }
  
  return matchedSpaces;
}

function checkSpaceConditions(bgioArguments, space, conditions, chunkMatches = []) {
  return  checkConditions(
    bgioArguments,
    { conditions },
    {
      target: space,
      targets: [space, ...chunkMatches] // for ContainsSame, other group conditions
    }
  ).conditionsAreMet
}
