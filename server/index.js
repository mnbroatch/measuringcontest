import { Server, Origins } from 'boardgame.io/dist/cjs/server.js'
import TicTacToe from './tic-tac-toe.js';
import StrictInMemory from './strict-in-memory.js';

const server = Server({
  games: [TicTacToe],
  origins: [Origins.LOCALHOST],
  db: new StrictInMemory(),
});

server.run(8000);
