'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nslookup = require('nslookup');

var _nslookup2 = _interopRequireDefault(_nslookup);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _thenRedis = require('then-redis');

require('babel-core/register');

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var db = (0, _thenRedis.createClient)();

/**
 * format the response from nxlookup
 * @param {object} response 
 * @param {object} error 
 * @return {object}
 */
var setResponse = function setResponse(data, error) {
    var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'db';

    var response = null;

    if (error) {
        response = { error: error.name };
        return JSON.stringify(response);
    }

    if (Array.isArray(data)) {
        response = data.length ? { mx: true, server: data, source: source } : { mx: false };
        return JSON.stringify(response);
    }

    return JSON.stringify({ mx: false });
};

/** fetch MX record from db or DNS if not found on db
 * @param {string} domain 
 * @param {object} res express server response
 */
var fetchDB = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var domain, data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        domain = req.params.domain;
                        _context.next = 3;
                        return db.get(domain).then(function (response) {
                            return JSON.parse(response);
                        });

                    case 3:
                        data = _context.sent;

                        if (!data) {
                            _context.next = 7;
                            break;
                        }

                        res.send(setResponse(data)); // send output to server
                        return _context.abrupt('return');

                    case 7:

                        //fetch DNS and store new value un db
                        (0, _nslookup2.default)(domain).server(_config2.default.dnsServer).type('mx').timeout(_config2.default.lookupTimeout).end(function (error, data) {

                            if (error) data = null;

                            storeInDB(domain, data);
                            res.send(setResponse(data, error, 'dns')); // send output to server
                        });

                        return _context.abrupt('return');

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function fetchDB(_x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

var storeInDB = function storeInDB(domain, data) {
    return data ? db.set(domain, JSON.stringify(data), 'EX', _config2.default.domainDataExpire) : db.set(domain, null, 'EX', 1);
};

var mxlookup = function mxlookup(req, res) {

    res.setHeader('Content-Type', 'application/json');

    if (!req.params.domain) {
        res.send(JSON.stringify({ error: 'no_domain' }));
        return;
    }

    fetchDB(req, res);
};

exports.default = mxlookup;