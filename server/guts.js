// ripped and stretched from the internals of bgio
import Koa from 'koa';
import Router from '@koa/router';
import { Server, configureRouter, createServerRunConfig, configureApp, getPortFromServer, Master, TransportAPI } from 'boardgame.io/dist/cjs/server.js';
import { ProcessGameConfig, getFilterPlayerView } from 'boardgame.io/dist/cjs/internal.js';


// just exists so we're not reliant on closure from constructor for router, games
async function newRun (server, portOrConfig, callback) {
  const { games, db, app, router, uuid, auth, origins, apiOrigins = origins } = server

  await db.connect();

  const serverRunConfig = createServerRunConfig(portOrConfig, callback);
  const lobbyConfig = serverRunConfig.lobbyConfig;
  let apiServer;
  if (!lobbyConfig || !lobbyConfig.apiPort) {

    configureApp(app, router, apiOrigins);
  } else {
    // Run API in a separate Koa app.
    const api = new Koa();
    api.context.db = db;
    api.context.auth = auth;
    configureApp(api, router, apiOrigins);
    await new Promise((resolve) => {
      apiServer = api.listen(lobbyConfig.apiPort, resolve);
    });
    if (lobbyConfig.apiCallback)
      lobbyConfig.apiCallback();
    console.log(`API serving on ${getPortFromServer(apiServer)}...`);
  }
  // Run Game Server (+ API, if necessary).
  let appServer;
  await new Promise((resolve) => {
      appServer = app.listen(serverRunConfig.port, resolve);
  });
  if (serverRunConfig.callback)
      serverRunConfig.callback();
  console.log(`App serving on ${getPortFromServer(appServer)}...`);
  return { apiServer, appServer };
}

// all this to configure router to use mutable games array
export default function makeServer (serverOptions) {
  // get most stuff from old Server constructor
  const server = new Server(...arguments) // just in case api changes
  const { db, uuid, auth } = server

  server.games = (serverOptions.games || []).map(game => ProcessGameConfig(game))
  server.origins = serverOptions.origins
  const newApp = new Koa();
  newApp.context.db = server.db;
  newApp.context.auth = server.auth;

  server.transport.init(newApp, server.games, server.origins);

  const newRouter = new Router();
  configureRouter({ router: newRouter, db, games: server.games, uuid, auth });
  server.app = newApp
  server.router = newRouter
  server.run = (portOrConfig, callback) => newRun(server, portOrConfig, callback)
  server.transport.addGameSocketListeners = addGameSocketListeners
  return server
}

// MAYBE there's a way to mutate ioOptions on server.transport such that
// re-calling server.transport.init() works instead of this?
function addGameSocketListeners(app, game) {
  const nsp = app._io.of(game.name);
  const filterPlayerView = getFilterPlayerView(game);
  nsp.on('connection', (socket) => {
      socket.on('update', async (...args) => {
          const [action, stateID, matchID, playerID] = args;
          const master = new Master(game, app.context.db, new TransportAPI(game, socket, filterPlayerView, this.pubSub), app.context.auth);
          const matchQueue = this.getMatchQueue(matchID);
          await matchQueue.add(() => master.onUpdate(action, stateID, matchID, playerID));
      });
      socket.on('sync', async (...args) => {
          const [matchID, playerID, credentials] = args;
          socket.join(matchID);
          this.removeClient(socket.id);
          const requestingClient = { socket, matchID, playerID, credentials };
          const transport = new TransportAPI(game, socket, filterPlayerView, this.pubSub);
          const master = new Master(game, app.context.db, transport, app.context.auth);
          const syncResponse = await master.onSync(...args);
          if (syncResponse && syncResponse.error === 'unauthorized') {
              return;
          }
          this.addClient(requestingClient, game);
          await master.onConnectionChange(matchID, playerID, credentials, true);
      });
      socket.on('disconnect', async () => {
          const client = this.clientInfo.get(socket.id);
          this.removeClient(socket.id);
          if (client) {
              const { matchID, playerID, credentials } = client;
              const master = new Master(game, app.context.db, new TransportAPI(game, socket, filterPlayerView, this.pubSub), app.context.auth);
              await master.onConnectionChange(matchID, playerID, credentials, false);
          }
      });
      socket.on('chat', async (...args) => {
          const [matchID] = args;
          const master = new Master(game, app.context.db, new TransportAPI(game, socket, filterPlayerView, this.pubSub), app.context.auth);
          master.onChatMessage(...args);
      });
  });
}
