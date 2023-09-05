'use strict';

var http = require('http');
var https = require('https');
var objectAssign = require('object-assign');
var path = require('path');

var utils = require('./utils');
var Error = require('./Error');

var hasOwn = {}.hasOwnProperty;

// Provide extension mechanism for MC2P Resource Sub-Classes
MC2PResource.extend = utils.protoExtend;

// Expose method-creator & prepared (basic) methods
MC2PResource.method = require('./MC2PMethod');
MC2PResource.BASIC_METHODS = require('./MC2PMethod.basic.js');

/**
 * Encapsulates request logic for a MC2P Resource
 */
function MC2PResource(MC2P, urlData) {
    this._MC2P = MC2P;
    this._urlData = urlData || {};

    this.basePath = utils.makeURLInterpolator(MC2P.getApiField('basePath'));
    this.path = utils.makeURLInterpolator(this.path);

    if (this.includeBasic) {
        this.includeBasic.forEach(function (methodName) {
            this[methodName] = MC2PResource.BASIC_METHODS[methodName];
        }, this);
    }

    this.initialize.apply(this, arguments);
}

MC2PResource.prototype = {

    path: '',

    initialize: function () {
    },

    // String that overrides the base API endpoint. If `overrideHost` is not null
    // then all requests for a particular resource will be sent to a base API
    // endpoint as defined by `overrideHost`.
    overrideHost: null,

    createFullPath: function (commandPath, urlData) {
        return path.join(
          this.basePath(urlData),
          this.path(urlData),
          typeof commandPath === 'function' ?
            commandPath(urlData) : commandPath
        ).replace(/\\/g, '/'); // ugly workaround for Windows
    },

    createUrlData: function () {
        var urlData = {};
        // Merge in baseData
        for (var i in this._urlData) {
            if (hasOwn.call(this._urlData, i)) {
                urlData[i] = this._urlData[i];
            }
        }
        return urlData;
    },

    wrapTimeout: function (promise, callback) {
        if (callback) {
            // Ensure callback is called outside of promise stack.
            return promise.then(function (res) {
                setTimeout(function () {
                    callback(null, res);
                }, 0);
            }, function (err) {
                setTimeout(function () {
                    callback(err, null);
                }, 0);
            });
        }

        return promise;
    },

    _timeoutHandler: function (timeout, req, callback) {
        var self = this;
        return function () {
            var timeoutErr = new Error('ETIMEDOUT');
            timeoutErr.code = 'ETIMEDOUT';

            req._isAborted = true;
            req.abort();

            callback.call(
              self,
              new Error.ConnectionError({
                  message: 'Request aborted due to timeout being reached (' + timeout + 'ms)',
                  detail: timeoutErr
              }),
              null
            );
        };
    },

    _responseHandler: function (req, callback) {
        var self = this;
        return function (res) {
            var response = '';

            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                response += chunk;
            });
            res.on('end', function () {
                try {
                    response = JSON.parse(response);
                    if (response.errors) {
                        return callback.call(self, response.errors, null);
                    }
                } catch (e) {
                    return callback.call(
                      self,
                      new Error.APIError({
                          message: 'Invalid JSON received from the MC2P API',
                          response: response,
                          exception: e
                      }),
                      null
                    );
                }
                // Expose res object
                Object.defineProperty(response, 'lastResponse', {
                    enumerable: false,
                    writable: false,
                    value: res
                });
                callback.call(self, null, response);
            });
        };
    },

    _errorHandler: function (req, callback) {
        var self = this;
        return function (error) {
            if (req._isAborted) {
                // already handled
                return;
            }
            callback.call(
              self,
              new Error.ConnectionError({
                  message: 'An error occurred with our connection to MC2P',
                  detail: error
              }),
              null
            );
        };
    },

    _request: function (method, path, data, auth, options, callback) {
        var self = this;
        var requestData = data;
        if (method === 'GET') {
            requestData = '';
        } else {
            requestData = JSON.stringify(data);
        }

        var headers = {
            'Authorization': 'AppKeys ' + this._MC2P.getApiField('key'),
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestData, 'utf8')
        };

        // Grab client-user-agent before making the request:
        this._MC2P.getClientUserAgent(function () {
            if (options.headers) {
                objectAssign(headers, options.headers);
            }
            makeRequest();
        });

        function makeRequest() {
            var timeout = self._MC2P.getApiField('timeout');
            var isInsecureConnection = self._MC2P.getApiField('protocol') === 'http';

            var host = self.overrideHost || self._MC2P.getApiField('host');
            var params = {
                host: host,
                port: self._MC2P.getApiField('port'),
                path: path,
                method: method,
                agent: self._MC2P.getApiField('agent'),
                headers: headers
            };

            var req = (
              isInsecureConnection ? http : https
            ).request(params);

            req.setTimeout(timeout, self._timeoutHandler(timeout, req, callback));
            req.on('response', self._responseHandler(req, callback));
            req.on('error', self._errorHandler(req, callback));

            req.on('socket', function (socket) {
                socket.on((isInsecureConnection ? 'connect' : 'secureConnect'), function () {
                    // Send payload; we're safe:
                    req.write(requestData);
                    req.end();
                });
            });
        }
    }

};

module.exports = MC2PResource;
