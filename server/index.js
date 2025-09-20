import { Readable } from "stream";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { Server, Origins } from 'boardgame.io/dist/cjs/server.js';
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
  origins: [/.*/],
  
  generateCredentials: async (ctx) => {
    console.log('ctx', ctx)
    const body = ctx.request.body;
    return {
      gameId: body.gameId,
      canonicalUserId: body.playerName
    };
  },
  
  authenticateCredentials: async (credentials, playerMetadata) => {
    console.log('playerMetadata', playerMetadata)
    if (!credentials || !playerMetadata.credentials) return false;
    
    try {
      const secret = await getJwtSecret();
      const decoded = jwt.verify(credentials, secret);
      const stored = playerMetadata.credentials;
      
      // Validate both gameId and playerID match
      return decoded.gameId === stored.gameId && 
             decoded.boardgamePlayerID === playerMetadata.id;
    } catch (err) {
      return false;
    }
  }
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

server.app.use((ctx, next) => {
  if (ctx.path === '/health') {
    ctx.body = { ok: true };
    return;
  }
  return next();
});

server.run(BOARDGAME_PORT);
console.log(`Boardgame.io server running on port ${BOARDGAME_PORT}`);
