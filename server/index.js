import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { Server } from 'boardgame.io/dist/cjs/server.js';
import TicTacToe from './tic-tac-toe.js';
import jwt from 'jsonwebtoken';

const ssmClient = new SSMClient({ region: 'us-east-1' });
const BOARDGAME_PORT = 8000;

// In-memory map: gameId -> Set of allowed custom playerIds
const gamePermissions = new Map();

// Cache JWT secret
let cachedJwtSecret = null;
async function getJwtSecret() {
  if (cachedJwtSecret) return cachedJwtSecret;

  const response = await ssmClient.send(new GetParameterCommand({
    Name: "/measuringcontest/boardgame-jwt-secret",
    WithDecryption: true,
  }));
  cachedJwtSecret = response.Parameter.Value;
  return cachedJwtSecret;
}

// Initialize boardgame.io server
const server = Server({
  games: [TicTacToe],
});

// --- JWT verification middleware on /create ---
server.app.use(async (ctx, next) => {
  if (ctx.path.includes('/create')) {
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
      console.log('JWT verified successfully');
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      ctx.status = 401;
      ctx.body = { error: 'Invalid token' };
      return;
    }
  }

  await next();
});

// --- Intercept game creation to store allowed players ---
server.router.post('/games/:name/create', async (ctx, next) => {
  const body = ctx.request.body || {};
  const allowedPlayers = Array.isArray(body.allowedPlayers) ? body.allowedPlayers : [];

  // Let boardgame.io create the game first
  await next();

  const gameId = ctx.response.body.gameID;

  if (allowedPlayers.length) {
    gamePermissions.set(gameId, new Set(allowedPlayers));
    console.log(`Game ${gameId} created with allowed players:`, allowedPlayers);
  }
});

// --- Block unauthorized join attempts ---
server.router.post('/games/:name/:id/join', async (ctx, next) => {
  const gameId = ctx.params.id;
  const body = ctx.request.body || {};
  const playerId = body.playerId;

  if (!playerId) {
    ctx.status = 400;
    ctx.body = { error: 'Missing playerId' };
    return;
  }

  const allowedPlayers = gamePermissions.get(gameId);

  if (allowedPlayers && !allowedPlayers.has(playerId)) {
    ctx.status = 403;
    ctx.body = { error: `Player "${playerId}" is not authorized to join this game` };
    console.log(`Blocked unauthorized join attempt: ${playerId} -> game ${gameId}`);
    return;
  }

  console.log(`Authorized join: ${playerId} -> game ${gameId}`);
  await next();
});

// --- Optional health endpoint ---
server.app.use((ctx, next) => {
  if (ctx.path === '/health') {
    ctx.body = { ok: true };
    return;
  }
  return next();
});

// --- Start server ---
server.run(BOARDGAME_PORT);
console.log(`Boardgame.io server running on port ${BOARDGAME_PORT}`);



// setInterval(() => {
//   console.log(server.db.metadata)
// }, 1000)

