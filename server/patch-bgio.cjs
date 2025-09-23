const fs = require('fs');
const path = require('path');

const serverFile = path.join(
  __dirname,
  'node_modules',
  'boardgame.io',
  'dist/cjs/server.js'
);

fs.appendFileSync(
  serverFile,
  "\nexports.configureRouter = configureRouter;"
);
