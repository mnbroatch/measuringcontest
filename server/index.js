const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const { Server, Origins } = require('boardgame.io/server'); // Fixed import
import TicTacToe from './tic-tac-toe.js';
const jwt = require('jsonwebtoken'); // Missing import

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
  const { allowedPlayers } = ctx.request.body;
  
  if (allowedPlayers && Array.isArray(allowedPlayers)) {
    // Server derives numPlayers from allowedPlayers length
    ctx.request.body.numPlayers = allowedPlayers.length;
  }
  
  // Let boardgame.io create the game first
  await next();
  
  const gameID = ctx.response.body.gameID;
  
  if (allowedPlayers && Array.isArray(allowedPlayers)) {
    // Store allowed players in memory
    gamePermissions.set(gameID, new Set(allowedPlayers));
    console.log(`Game ${gameID} created with allowed players:`, allowedPlayers);
  }
});

// Block unauthorized join attempts
server.router.post('/games/:name/:id/join', async (ctx, next) => {
  const gameID = ctx.params.id;
  const { playerName } = ctx.request.body;
  
  const allowedPlayers = gamePermissions.get(gameID);
  
  if (!allowedPlayers) {
    console.log(`No player restrictions for game ${gameID}`);
    await next();
    return;
  }
  
  if (!allowedPlayers.has(playerName)) {
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

