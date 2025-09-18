import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { Server } from 'boardgame.io/dist/cjs/server.js';
import TicTacToe from './tic-tac-toe.js';
import jwt from 'jsonwebtoken'

const ssmClient = new SSMClient({ region: 'us-east-1' });

const gamePermissions = new Map();

const server = Server({
  games: [TicTacToe],
});

let cachedJwtSecret = null;

async function getJwtSecret() {
  if (cachedJwtSecret) {
    return cachedJwtSecret;
  }
  
  const response = await ssmClient.send(new GetParameterCommand({
    Name: "/measuringcontest/boardgame-jwt-secret",
    WithDecryption: true
  }));
  
  cachedJwtSecret = response.Parameter.Value;
  return cachedJwtSecret;
}

server.app.use(async (ctx, next) => {
  if (ctx.path.includes('/create')) {
    try {
      const token = ctx.get('Authorization')?.replace('Bearer ', '');
      if (!token) {
        ctx.status = 401;
        ctx.body = { error: 'No token provided' };
        return;
      }
      
      const secret = await getJwtSecret();
      jwt.verify(token, secret);
      console.log('JWT verified successfully');
    } catch (err) {
      console.log('JWT verification failed:', err.message);
      ctx.status = 401;
      ctx.body = { error: 'Invalid token' };
      return;
    }
  }
  await next();
});

// Intercept game creation to store allowed players
server.router.post('/games/:name/create', async (ctx, next) => {
  // ctx.request.body is populated by boardgame.io already
  const body = ctx.request.body || {};
  const allowedPlayers = Array.isArray(body.allowedPlayers) ? body.allowedPlayers : [];

  // Let boardgame.io create the game first
  await next();

  const gameID = ctx.response.body.gameID;

  if (allowedPlayers.length) {
    gamePermissions.set(gameID, new Set(allowedPlayers));
    console.log(`Game ${gameID} created with allowed players:`, allowedPlayers);
  }
});

// Block unauthorized join attempts
server.router.post('/games/:name/:id/join', async (ctx, next) => {
  const gameID = ctx.params.id;
  const body = ctx.request.body || {};
  const playerName = body.playerName;

  const allowedPlayers = gamePermissions.get(gameID);

  if (allowedPlayers && !allowedPlayers.has(playerName)) {
    ctx.status = 403;
    ctx.body = { error: `Player "${playerName}" is not authorized to join this game` };
    console.log(`Blocked unauthorized join attempt: ${playerName} -> game ${gameID}`);
    return;
  }

  console.log(`Authorized join: ${playerName} -> game ${gameID}`);
  await next();
});

// Start server
server.run(8000);

// setInterval(() => {
//   console.log(server.db.metadata)
// }, 1000)

