import _matches from "lodash/matches.js";
import Condition from "./condition.js";
import conditionFactory from "./condition-factory.js";

const directions = [[1, 0], [1, 1], [0, 1], [-1, 1]];

export default class InLineCondition extends Condition {
  checkCondition(bgioArguments, payload) {
    const { G } = bgioArguments;
    const { target } = payload;
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
      const lineMatches = findSequencesInLine(bgioArguments, lineSpaces, sequencePattern, sequenceLength);
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
  
  // Keep matching until we run out of space
  while (startIndex <= lineSpaces.length - minSequenceLength) {
    const matchedSpaces = tryMatchSequence(bgioArguments, lineSpaces, startIndex, sequencePattern);
    
    if (matchedSpaces) {
      matches.push(matchedSpaces);
      // Skip past this match to avoid overlaps
      startIndex += matchedSpaces.length;
    } else {
      // No match at this position, try next position
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
    
    // Determine the target counts
    let min, max;
    if (count !== undefined) {
      // Exact count
      min = max = count;
    } else {
      // Range
      min = minCount || 1;
      max = maxCount || Infinity;
    }
    
    let matchedCount = 0;
    
    // Greedy: try to match as many as possible up to max
    while (matchedCount < max && spaceIndex < lineSpaces.length) {
      const space = lineSpaces[spaceIndex];
      
      if (checkConditions(bgioArguments, space, conditions)) {
        matchedSpaces.push(space);
        matchedCount++;
        spaceIndex++;
      } else {
        // Can't match more
        break;
      }
    }
    
    // Check if we met the minimum requirement
    if (matchedCount < min) {
      return null; // Sequence failed
    }
  }
  
  return matchedSpaces;
}

function checkConditions(bgioArguments, space, conditions) {
  return conditions.every(condition => 
    conditionFactory(condition).isMet(bgioArguments, space)
  );
}
