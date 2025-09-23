// ripped and stretched from the internals of bgio
import Koa from 'koa';
import Router from '@koa/router';
import { Server, configureRouter, createServerRunConfig, configureApp, getPortFromServer } from 'boardgame.io/dist/cjs/server.js';
import { ProcessGameConfig } from 'boardgame.io/dist/cjs/internal.js';


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
  const newRouter = new Router();
  configureRouter({ router: newRouter, db, games: server.games, uuid, auth });
  server.app = newApp
  server.router = newRouter
  server.run = (portOrConfig, callback) => newRun(server, portOrConfig, callback)

  return server
}

