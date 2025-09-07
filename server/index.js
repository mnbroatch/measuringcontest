import { Server, Origins } from 'boardgame.io/dist/cjs/server.js'
import { TicTacToe } from './tic-tac-toe.js';

const server = Server({
  games: [TicTacToe],
  origins: [Origins.LOCALHOST],
});

server.run(8000);
