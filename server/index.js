import { Readable } from "stream";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { Server } from 'boardgame.io/dist/cjs/server.js';
import TicTacToe from './tic-tac-toe.js';
import jwt from 'jsonwebtoken';

const ssmClient = new SSMClient({ region: 'us-west-1' });
const BOARDGAME_PORT = 8000;


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
  games: [TicTacToe],
  authenticateCredentials: async (credentials, playerMetadata) => {
    if (!credentials) return false; // No spectators
    
    try {
      const secret = await getJwtSecret();
      const decoded = jwt.verify(credentials, secret);

      return decoded.gameId === playerMetadata.matchID
        && decoded.boardgamePlayerID === playerMetadata.id;
    } catch (err) {
      return false;
    }
  }
});

// only allow rest api calls from lambda, which signs jwt
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


