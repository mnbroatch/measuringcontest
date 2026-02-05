import { ActivePlayers } from 'boardgame.io/dist/cjs/core.js';

const RoomGame = {
  name: 'bgestagingroom',
  setup: (_, setupData) => ({
    players: { '1': { name: 'Room Creator' } },
    status: 'waiting',
    gameRules: '',
    gameName: '',
    ...setupData?.initialState,
  }),
  turn: {
    activePlayers: ActivePlayers.ALL,
  },
  moves: {
    join: ({G, playerID}, name) => {
      if (G.status === 'waiting') {
        G.players[playerID] = {
          name: name || G.players[playerID] || `Player ${playerID}`
        };
      }
    },
    leave: ({G, playerID}) => {
      if (playerID !== '1') {
        delete G.players[playerID]
      }
    },
    kick: ({G, playerID}, targetPlayerID) => {
      if (playerID === '0' && targetPlayerID !== '1') {
        delete G.players[targetPlayerID];
      }
    },
    setGameMeta: ({G, playerID}, { gameRules, gameName }) => {
      if ((playerID === '0' || playerID === '1') && G.status === 'waiting') {
        G.gameRules = gameRules
        G.gameName = gameName
      }
    },
    gameCreated: ({G, playerID}, newGameId) => {
      if (playerID === '0' && G.status === 'waiting') {
        G.gameId = newGameId;
        G.status = 'started';
      }
    },
    gameDeleted: ({G, playerID}) => {
      if (playerID === '0') {
        delete G.gameId;
        G.status = 'waiting';
      }
    },
    roomDeleted: ({G, playerID}) => {
      if (playerID === '0') {
        G.status = 'deleted';
      }
    },
  },
};

export default RoomGame
