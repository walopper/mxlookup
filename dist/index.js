'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _mxlookup = require('./mxlookup');

var _mxlookup2 = _interopRequireDefault(_mxlookup);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use((0, _compression2.default)());
var server = _http2.default.createServer(app);

app.get('/', function (req, res) {
  res.send('Nada para ver por aquí');
});

app.get('/:user@:domain', _mxlookup2.default);

app.get('/:user%40:domain', _mxlookup2.default);

app.get('/:domain', _mxlookup2.default);

server.listen(_config2.default.port, _config2.default.ip, function () {
  console.log('Express server listening on http://' + _config2.default.ip + ':' + _config2.default.port);
});