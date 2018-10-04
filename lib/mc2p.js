'use strict';

/*
 Thanks to https://github.com/stripe/stripe-node
 */

MC2P.DEFAULT_HOST = 'api.mychoice2pay.com';
MC2P.DEFAULT_PORT = '443';
MC2P.DEFAULT_BASE_PATH = '/v1';
MC2P.DEFAULT_RESPONSE_FORMAT = '.json';
MC2P.DEFAULT_API_VERSION = null;

// Use node's default timeout:
MC2P.DEFAULT_TIMEOUT = require('http').createServer().timeout;

MC2P.PACKAGE_VERSION = require('../package.json').version;

MC2P.USER_AGENT = {
    bindings_version: MC2P.PACKAGE_VERSION,
    lang: 'node',
    lang_version: process.version,
    platform: process.platform,
    publisher: 'mc2p',
    uname: null
};

MC2P.USER_AGENT_SERIALIZED = null;

var exec = require('child_process').exec;

var resources = {
    Product: require('./resources/Product'),
    Plan: require('./resources/Plan'),
    Tax: require('./resources/Tax'),
    Shipping: require('./resources/Shipping'),
    Coupon: require('./resources/Coupon'),
    Transaction: require('./resources/Transaction'),
    Subscription: require('./resources/Subscription'),
    Sale: require('./resources/Sale'),
    Currency: require('./resources/Currency'),
    Gateway: require('./resources/Gateway'),
    PayData: require('./resources/PayData')
};

MC2P.MC2PResource = require('./MC2PResource');
MC2P.resources = resources;

function MC2P(key, secretKey) {
    if (!(this instanceof MC2P)) {
        return new MC2P(key, secretKey);
    }

    this._api = {
        auth: null,
        host: MC2P.DEFAULT_HOST,
        port: MC2P.DEFAULT_PORT,
        basePath: MC2P.DEFAULT_BASE_PATH,
        version: MC2P.DEFAULT_API_VERSION,
        timeout: MC2P.DEFAULT_TIMEOUT,
        agent: null,
        dev: false
    };

    this._prepResources();
    this.setApiKey(key, secretKey);
    this.setResponseFormat(MC2P.DEFAULT_RESPONSE_FORMAT);


    this.notification = require('./Notification');
}

MC2P.prototype = {

    setHost: function (host, port, protocol) {
        this._setApiField('host', host);
        if (port) {
            this.setPort(port);
        }
        if (protocol) {
            this.setProtocol(protocol);
        }
    },

    setProtocol: function (protocol) {
        this._setApiField('protocol', protocol.toLowerCase());
    },

    setPort: function (port) {
        this._setApiField('port', port);
    },

    setResponseFormat: function (format) {
        this._setApiField('format', format);
    },

    setApiKey: function (key, secretKey) {
        if (key && secretKey) {
            this._setApiField('key', key + ':' + secretKey);
        }
    },

    setTimeout: function (timeout) {
        this._setApiField(
          'timeout',
          timeout === null ? MC2P.DEFAULT_TIMEOUT : timeout
        );
    },

    setHttpAgent: function (agent) {
        this._setApiField('agent', agent);
    },

    _setApiField: function (key, value) {
        this._api[key] = value;
    },

    getApiField: function (key) {
        return this._api[key];
    },

    getResponseFormat: function (key) {
        return this._api[key];
    },

    getConstant: function (c) {
        return MC2P[c];
    },

    // Gets a JSON version of a User-Agent and uses a cached version for a slight
    // speed advantage.
    getClientUserAgent: function (cb) {
        if (MC2P.USER_AGENT_SERIALIZED) {
            return cb(MC2P.USER_AGENT_SERIALIZED);
        }
        this.getClientUserAgentSeeded(MC2P.USER_AGENT, function (cua) {
            MC2P.USER_AGENT_SERIALIZED = cua;
            cb(MC2P.USER_AGENT_SERIALIZED);
        });
    },

    // Gets a JSON version of a User-Agent by encoding a seeded object and
    // fetching a uname from the system.
    getClientUserAgentSeeded: function (seed, cb) {
        exec('uname -a', function (err, uname) {
            var userAgent = {};
            for (var field in seed) {
                userAgent[field] = encodeURIComponent(seed[field]);
            }

            // URI-encode in case there are unusual characters in the system's uname.
            userAgent.uname = encodeURIComponent(uname) || 'UNKNOWN';

            cb(JSON.stringify(userAgent));
        });
    },

    _prepResources: function () {
        for (var name in resources) {
            this[
            name[0].toLowerCase() + name.substring(1)
              ] = new resources[name](this);
        }
    }
};

module.exports = MC2P;
// expose constructor as a named property to enable mocking with Sinon.JS
module.exports.MC2P = MC2P;
