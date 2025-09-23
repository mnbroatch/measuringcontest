import { Readable } from "stream";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { Server, Origins, configureRouter } from 'boardgame.io/dist/cjs/server.js';
import { ProcessGameConfig } from 'boardgame.io/dist/cjs/internal.js';
import TicTacToe from './tic-tac-toe.js';
import gameFactory from './game-factory.js';
import jwt from 'jsonwebtoken';

const ssmClient = new SSMClient({ region: 'us-west-1' });
const BOARDGAME_PORT = 8000;
const ORIGINS = [/.*/]
const INITIAL_GAMES = []
// const INITIAL_GAMES = [TicTacToe]

// Cache JWT secret
let cachedJwtSecret = null;
async function getJwtSecret() {
  if (cachedJwtSecret) {
    return cachedJwtSecret;
  }
  const response = await ssmClient.send(new GetParameterCommand({
    Name: "/measuringcontest/boardgame-jwt-secret",
    WithDecryption: true,
  }));
  cachedJwtSecret = response.Parameter.Value;
  return cachedJwtSecret;
}

const server = Server({
  games: INITIAL_GAMES,
  origins: ORIGINS,
  
  authenticateCredentials: async (credentials, playerMetadata) => {
    try {
      const jwtSecret = await getJwtSecret();
      const decoded = jwt.verify(credentials, jwtSecret);
      return decoded.gameId && decoded.playerId
        && decoded.gameId === playerMetadata.data.gameId && decoded.playerId === playerMetadata.data.playerId;
    } catch (error) {
      return false;
    }
  },
});
server._games = INITIAL_GAMES
server._origins = ORIGINS

// REST API JWT middleware (unchanged)
server.app.use(async (ctx, next) => {
  if (ctx.method !== 'GET' && ctx.path.startsWith('/games/')) {
    try {
      const authHeader = ctx.get('Authorization') || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
      if (!token) {
        ctx.status = 401;
        ctx.body = { error: 'No token provided' };
        return;
      }
      const secret = await getJwtSecret();
      jwt.verify(token, secret);
    } catch (err) {
      ctx.status = 401;
      ctx.body = { error: 'Invalid token' };
      return;
    }
  }
  await next();
});

// hack to dynamically register game configs on game creation
server.app.use(async (ctx, next) => {
  const match = ctx.path.match(/^\/games\/([^/]+)\/create$/);
  if (ctx.method === 'POST' && match) {
    const gameName = match[1];

    if (!server._games) server._games = [];

    if (!server._games.find(g => g.name === gameName)) {
      const newGameDef = gameFactory(gameName);
      const processedGame = ProcessGameConfig(newGameDef);
      server._games.push(processedGame);

      // Re-run configureRouter with full games array
      configureRouter({
        router: server.router,
        db: server.db,
        games: server._games,
        uuid: server.uuid,
        auth: server.auth,
      });

      // Add socket namespace
      server.transport.init(server.app, [processedGame], server._origins);
    }
  }

  await next();
});

server.app.use((ctx, next) => {
  if (ctx.path === '/health') {
    ctx.body = { ok: true };
    return;
  }
  return next();
});

server.run(BOARDGAME_PORT);
console.log(`Boardgame.io server running on port ${BOARDGAME_PORT}`);
