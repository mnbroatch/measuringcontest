// haven't verified cache invalidation robustness
import _matches from "lodash/matches.js";
import Condition from "./condition.js";
import checkConditions from "../utils/check-conditions.js";

// Only use 4 directions - we'll check both directions along each line
const directions = [
  [1, 0],   // horizontal
  [0, 1],   // vertical
  [1, 1],   // diagonal down-right
  [-1, 1],  // diagonal down-left
];

// Cache for grid sequences - WeakMap so it gets garbage collected with the grid
const sequenceCache = new WeakMap();

export default class InLineCondition extends Condition {
  checkCondition(bgioArguments, rule, payload, context) {
    const { G } = bgioArguments;
    const { target } = payload;
    const parent = G.bank.findParent(payload.target);
    
    // Find all sequences in the grid
    const { matches: allMatches } = gridContainsSequence(bgioArguments, parent, rule.sequence, context);
    
    // Filter to only sequences that contain the target space
    const matches = allMatches.filter(sequence => 
      sequence.some(space => space === target)
    );

    return { matches, conditionIsMet: !!matches.length };
  }
}

// Helper to create a cache key from sequence pattern
function getSequenceKey(sequencePattern) {
  return JSON.stringify(sequencePattern);
}

// Shared function for finding all sequences in a grid
export function gridContainsSequence(bgioArguments, grid, sequencePattern, context) {
  // Check cache first
  const cacheKey = getSequenceKey(sequencePattern);
  let gridCache = sequenceCache.get(grid);
  
  if (!gridCache) {
    gridCache = new Map();
    sequenceCache.set(grid, gridCache);
  }
  
  // Check if we've already calculated this sequence for this grid state
  const gridStateKey = getGridStateKey(grid);
  const cacheEntry = gridCache.get(cacheKey);
  
  if (cacheEntry && cacheEntry.stateKey === gridStateKey) {
    return cacheEntry.result;
  }
  
  // Calculate matches
  const matches = [];
  
  // Calculate minimum sequence length once
  const minSequenceLength = sequencePattern.reduce((sum, chunk) => 
    sum + (chunk.minCount || chunk.count || 1), 0
  );
  
  // For each direction, scan each row/column/diagonal once
  for (const [dx, dy] of directions) {
    const lines = getLineStartingPoints(grid, dx, dy);
    
    for (const [startX, startY] of lines) {
      const lineSpaces = getLineSpaces(grid, startX, startY, dx, dy);
      
      // Skip lines that are too short (before processing)
      if (lineSpaces.length < minSequenceLength) {
        continue;
      }
      
      // Check both forward and backward along this line
      const forwardMatches = findSequencesInLine(bgioArguments, lineSpaces, sequencePattern, minSequenceLength, context);
      matches.push(...forwardMatches);
      
      // Only reverse if needed (avoid creating new arrays unnecessarily)
      if (forwardMatches.length === 0 || sequencePattern.length > 1) {
        const reverseMatches = findSequencesInLine(bgioArguments, lineSpaces, sequencePattern, minSequenceLength, context, true);
        matches.push(...reverseMatches);
      }
    }
  }
  
  const result = { matches, conditionIsMet: !!matches.length };
  
  // Store in cache
  gridCache.set(cacheKey, {
    stateKey: gridStateKey,
    result
  });
  
  return result;
}

// Create a state key based on what spaces contain
function getGridStateKey(grid) {
  // Create a comprehensive hash that captures any state change
  const spaces = grid.entities || [];
  return spaces.map(space => {
    const entities = space.entities || [];
    if (entities.length === 0) return 'empty';
    
    // Include all entity data that could affect conditions
    return entities.map(entity => {
      // Serialize the entire entity state
      return JSON.stringify({
        id: entity.entityId,
        type: entity.type,
        state: entity.state,
        // Add any other properties that conditions might check
        attributes: entity.attributes
      });
    }).sort().join('|');
  }).join(',');
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
    // Diagonal down-right: start from top row and left column
    for (let x = 0; x < width; x++) starts.push([x, 0]);
    for (let y = 1; y < height; y++) starts.push([0, y]);
  } else if (dx === -1 && dy === 1) {
    // Diagonal down-left: start from top row and right column
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

function findSequencesInLine(bgioArguments, lineSpaces, sequencePattern, minSequenceLength, context, reverse = false) {
  const matches = [];
  
  // Use original array or iterate in reverse without creating new array
  const length = lineSpaces.length;
  let startIndex = 0;
  
  while (startIndex <= length - minSequenceLength) {
    const matchedSpaces = tryMatchSequence(
      bgioArguments, 
      lineSpaces, 
      startIndex, 
      sequencePattern,
      context,
      reverse
    );
    
    if (matchedSpaces) {
      matches.push(matchedSpaces);
      startIndex++; // Move one space forward to find overlapping matches
    } else {
      startIndex++;
    }
  }
  
  return matches;
}

function tryMatchSequence(bgioArguments, lineSpaces, startIndex, sequencePattern, context, reverse = false) {
  let spaceIndex = startIndex;
  const matchedSpaces = [];
  const length = lineSpaces.length;
  
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
    while (matchedCount < max && spaceIndex < length) {
      // Access space directly or in reverse without creating new array
      const space = reverse 
        ? lineSpaces[length - 1 - spaceIndex]
        : lineSpaces[spaceIndex];
      
      // Pass all previously matched spaces in this chunk
      if (checkSpaceConditions(bgioArguments, space, conditions, chunkMatches, context)) {
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
  
  return matchedSpaces.length > 0 ? matchedSpaces : null;
}

function checkSpaceConditions(bgioArguments, space, conditions, chunkMatches = [], context) {
  // Early exit if no conditions
  if (!conditions || conditions.length === 0) {
    return true;
  }
  
  return checkConditions(
    bgioArguments,
    { conditions },
    {
      target: space,
      targets: [space, ...chunkMatches] // for ContainsSame, other group conditions
    },
    context
  ).conditionsAreMet
}
