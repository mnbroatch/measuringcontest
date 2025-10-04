import { Readable } from "stream";
import jwt from 'jsonwebtoken';
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import getRawBody from 'raw-body'
import { ActivePlayers } from 'boardgame.io/dist/cjs/core.js';
import { ProcessGameConfig } from 'boardgame.io/dist/cjs/internal.js';
import makeServer from './guts.js';
import gameFactory from './game-factory/game-factory.js';

const ssmClient = new SSMClient({ region: 'us-west-1' });

const RoomGame = {
  name: 'bgestagingroom',
  setup: () => ({
    players: { '0': 'Room Creator' },
    status: 'waiting',
    gameRules: '',
    gameName: '',
  }),
  turn: {
    activePlayers: ActivePlayers.ALL,
  },
  moves: {
    join: ({G, playerID}, name) => {
      if (G.status === 'waiting') {
        G.players[playerID] = { name };
      }
    },
    leave: ({G, playerID}) => {
      if (playerID !== '1') {
        delete G.players[playerID]
      }
    },
    setGameMeta: ({G, playerID}, { gameRules, gameName }) => {
      if (playerID === '1') {
        G.gameRules = gameRules
        G.gameName = gameName
      }
    },
    gameCreated: ({G, playerID}, newGameId) => {
      if (playerID === '0') {
        G.gameId = newGameId;
        G.status = 'started';
      }
    },
  },
};

const INITIAL_GAMES = [RoomGame]
const BOARDGAME_PORT = 8000;
const ORIGINS = [/.*/]

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
    const nameOrRulesHash = match[1];
    
    // Read and buffer the raw body
    const rawBody = await getRawBody(ctx.req, {
      length: ctx.request.length,
      encoding: 'utf8'
    });
    
    // Parse it manually
    const parsedBody = JSON.parse(rawBody);
    
    // Do your processing
    if (!server.games) server.games = [];
    if (!server.games.find(g => g.name === nameOrRulesHash)) {
      const gameRules = parsedBody?.gameRules;
      const newGameDef = gameFactory(JSON.parse(gameRules), nameOrRulesHash);
      const processedGame = ProcessGameConfig(newGameDef);
      server.games.push(processedGame);
      server.transport.addGameSocketListeners(server.app, processedGame);
    }
    
    // Recreate the stream with headers preserved
    const newStream = Readable.from([rawBody]);
    newStream.headers = ctx.req.headers; // Preserve headers
    ctx.req = newStream;
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

// setInterval (() => {
//   console.log('server', server)
// }, 5000)
