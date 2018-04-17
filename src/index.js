'use strict';

import express from 'express';
import http from 'http';
import compression from 'compression';
import mxlookup from './mxlookup';
import config from './config';

const app = express();
app.use(compression());
const server = http.createServer(app);

app.get('/', function (req, res) {
  res.send('Nada para ver por aquí');
});

app.get('/:user@:domain', mxlookup);

app.get('/:user%40:domain', mxlookup);

app.get('/:domain', mxlookup);

server.listen(config.port, config.ip, function () {
    console.log(`Express server listening on http://${config.ip}:${config.port}`);
});
