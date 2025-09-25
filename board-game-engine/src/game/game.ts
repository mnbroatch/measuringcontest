import cloneDeep from "lodash/cloneDeep.js";
import matches from "lodash/matches.js";
import merge from "lodash/merge.js";
import get from "lodash/get.js";
import boardFactory from "../board/board-factory.js";
import Player from "../player/player";
import roundFactory from "../round/round-factory.js";
import conditionFactory from "../condition/condition-factory.js";
import actionFactory from "../action/action-factory.js";
import Pile from "../piece/pile.js";
import findValuePath from "../utils/find-value-path.js";
import { serialize, deserialize } from "wackson";
import { registry } from "../registry.ts";

export interface GameRules {
  round: any;
  player: any;
  pieces: any[];
  sharedBoard: Record<string, any>;
  personalBoard?: Record<string, any>;
  initialPlacements?: any[];
  winCondition: any;
  drawCondition?: any;
}

export interface GameOptions {
  playerCount: number;
  [key: string]: any;
}

export interface Move {
  playerId: number;
  type?: string;
  piece?: {
    id?: string;
    name?: string;
    player?: {
      id: number;
    };
  };
  board?: string[];
  [key: string]: any;
}

export interface GameState {
  currentPhaseIndex: number;
  currentRoundIndex: number;
  context: Record<string, any>;
  status: 'waiting' | 'active' | 'done';
  winner: Player | null;
  sharedBoard: Record<string, any>;
  players: Player[];
  personalBoards: Record<string, any>;
  pieces: Pile[];
}

function initializeState(state: GameState, rules: GameRules): GameState {
  expandRules(rules)
  state.sharedBoard = Object.entries(rules.sharedBoard).reduce(
    (acc, [id, board]) => ({
      ...acc,
      [id]: boardFactory({ ...board, path: ["sharedBoard", id] }),
    }),
    {},
  );

  state.personalBoards = state.players.reduce(
    (acc, player) => ({
      ...acc,
      [player.id]: Object.entries(rules.personalBoard || []).reduce(
        (acc, [id, board]) => ({
          ...acc,
          [id]: boardFactory(
            { ...board, path: ["sharedBoard", id] },
            { player },
          ),
        }),
        {},
      ),
    }),
    {},
  );

  state.pieces = rules.pieces.reduce((acc, pieceRule) => {
    if (pieceRule.perPlayer) {
      return [
        ...acc,
        ...state.players.map((player) => new Pile(pieceRule, { player })),
      ];
    } else {
      return [...acc, new Pile(pieceRule)];
    }
  }, []);

  // Apply initial placements
  rules.initialPlacements?.forEach((placement) => {
    if (placement.perPlayer) {
      state.players.forEach((player) => {
        doInitialPlacement(placement, player, {
          sharedBoard: state.sharedBoard,
          personalBoards: state.personalBoards,
          pieces: state.pieces,
        });
      });
    } else {
      doInitialPlacement(placement, null, {
        sharedBoard: state.sharedBoard,
        personalBoards: state.personalBoards,
        pieces: state.pieces,
      });
    }
  });

  const currentRoundRule = rules.round.phases
    ? rules.round.phases[0]
    : rules.round;
  state.currentRound = roundFactory(currentRoundRule, state);

  state.status = 'active'

  return state;
}

function checkWinner(state: GameState, rules: GameRules): Player | null {
  return (
    state.players.find((player) => {
      const winCondition = {
        ...rules.winCondition,
        piece: {
          ...rules.winCondition.piece,
          player,
        },
      };
      const condition = conditionFactory(winCondition, state);
      return condition.isMet();
    }) || null
  );
}

function checkDraw(state: GameState, rules: GameRules): boolean {
  return !!(
    rules.drawCondition && conditionFactory(rules.drawCondition, state).isMet()
  );
}

function expandActionPayload(move: Move, state: GameState, rules: GameRules) {
  const player = state.players.find((p) => p.id === move.playerId);
  if (!player && move.type !== 'join' && move.type !== 'start') {
    throw new Error("Invalid player ID");
  }

  const pieceRule = rules.pieces.find((piece) => piece.name === move.piece?.name);

  const expandedMove = cloneDeep(move)
  if (pieceRule?.perPlayer && !expandedMove.player) {
    expandedMove.piece.player = { id: player.id };
  }

  if (!expandedMove.board) {
    expandedMove.board = getBoardPathContaining(expandedMove.piece, state);
  }

  expandedMove.board = normalizePath(expandedMove.board, { player });

  return expandedMove;
}

function handlePlayerJoin(state, rules, move) {
  if (state.players.length < rules.playerCountRange[1]) {
    state.players.push(new Player(rules.player, state.players.length, move.playerId))
  } else {
    throw new Error('game is full!')
  }
}

function handleStartGame(state,rules) {
  if (state.players.length >= rules.playerCountRange[0]) {
    initializeState(state, rules)
  } else {
    throw new Error('not enough players')
  }
}

export function makeMove(
  rules: GameRules,
  _state?: GameState,
  move?: Move,
): GameState {
  if (!_state) {
    return serialize({
      context: {},
      winner: null,
      status: 'waiting',
      players: [],
    })
  } 

  const state = deserializeState(_state)

  if (state.status === 'done') {
    throw new Error("Game is over!");
  }

  if (move === undefined) {
    return serialize(state);
  } else if (move?.type === 'join') {
    handlePlayerJoin(state, rules, move)
    return serialize(state)
  } else if (move.type === 'start') {
    handleStartGame(state, rules)
    return serialize(state)
  }


  // Expand the move payload with defaults and normalizations
  const expandedMove = expandActionPayload(move, state, rules);

  const round = state.currentRound

  round.doAction(expandedMove);
  // Check if round is over and advance if needed
  if (round.isOver(state)) {
    if (rules.round.phases) {
      // Get current phase rule
      const currentPhaseRule = rules.round.phases[state.currentRound.currentPhaseIndex];

      // Create round for current phase
      const phaseRound = roundFactory(currentPhaseRule, state);

      // If this phase is over, move to next phase
      if (phaseRound.isOver(state)) {
        state.currentRound.currentPhaseIndex++;

        // If we've completed all phases, start new round
        if (state.currentRound.currentPhaseIndex >= rules.round.phases.length) {
          state.currentRound.currentPhaseIndex = 0;
          state.currentRound.currentRoundIndex++;
        }
      }
    } else {
      // No phases, just increment round
      state.currentRound.currentRoundIndex++;
    }
  }

  // Check win/draw conditions
  const winner = checkWinner(state, rules);
  const isDraw = checkDraw(state, rules);

  if (winner || isDraw) {
    state.status = 'done'
    state.winner = winner
  }

  return serialize(state)
}

function doInitialPlacement(
  placement: {
    action: any;
    payload?: any;
    count?: number;
    rules: GameRules;
  },
  player: Player | null,
  state: GameState,
) {
  const actionRule = placement.action;
  const actionPayload = placement.payload || {};

  if (player) {
    actionPayload.player = player;
  }

  Array.from(new Array(placement.count || 1)).forEach(() => {
    const action = actionFactory(actionRule, state);
    action.do(expandActionPayload(actionPayload, state, rules));
  });
}

function getBoardPathContaining(
  piece: any,
  state: GameState,
  options?: any,
): string[] {
  return getPiecePaths(piece, state, options)[0];
}

function normalizePath(
  path: string[],
  options: { player?: Player } = {},
): string[] {
  return path[0] === "personalBoard" && options.player
    ? ["personalBoards", options.player.id.toString(), ...path.slice(1)]
    : path;
}

function getPiecePaths(
  matcher: any,
  state: GameState,
  options?: any,
): string[][] {
  const placesPiecesCanBe = {
    personalBoards: state.personalBoards,
    sharedBoard: state.sharedBoard,
    pieces: state.pieces,
  };

  return Array.from(findValuePath(placesPiecesCanBe, matches(matcher)))
    .filter((a) => a[a.length - 1] !== "rule")
    .sort((a) => (a[0] === "pieces" ? 1 : -1))
    .map((path) => normalizePath(path, options));
}

function expandOptions(options) {
  const defaultOptions = {
    playerCount: 2,
  };
  return merge({}, defaultOptions, options);
}

// mutates rules
function expandRules (rules) {
  addPathToRules(rules)
}

// mutates rules
export function addPathToRules (rules): void {
  const CHILD_KEYS = ['phases', 'rounds'];

  function annotate(node, pathSegs) {
    if (!node || typeof node !== 'object') return;

    // lodash.get path string, e.g. "round.phases.0.rounds.2"
    node.path = pathSegs.join('.');

    // recurse into either "phases" or "rounds" arrays if present
    for (const key of CHILD_KEYS) {
      const kids = node[key];
      if (Array.isArray(kids)) {
        kids.forEach((child, idx) => {
          annotate(child, pathSegs.concat(key, idx));
        });
      }
    }
  }

  // Top-level: support either "round" (object) or "rounds" (array), or both.
  if (rules.round && typeof rules.round === 'object') {
    annotate(rules.round, ['round']);
  }
  if (Array.isArray(rules.rounds)) {
    rules.rounds.forEach((r, i) => annotate(r, ['rounds', i]));
  }
}

function deserializeState (state) {
  return deserialize(
    state,
    registry
  )
}
