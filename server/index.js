import { Readable } from "stream";
import jwt from 'jsonwebtoken';
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { ProcessGameConfig } from 'boardgame.io/dist/cjs/internal.js';
import makeServer from './guts.js';
import TicTacToe from './tic-tac-toe.js';
import gameFactory from './game-factory.js';

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

const server = makeServer({
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

    if (!server.games) server.games = [];

    if (!server.games.find(g => g.name === gameName)) {
      const newGameDef = gameFactory(gameName);
      const processedGame = ProcessGameConfig(newGameDef);
      server.games.push(processedGame);

      // Add socket namespace
      server.transport.init(server.app, [processedGame], server.origins);
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

setInterval (() => {
  console.log('server', server)
}, 5000)
