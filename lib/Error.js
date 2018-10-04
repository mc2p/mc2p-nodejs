'use strict';

var utils = require('./utils');

module.exports = _Error;

/**
 * Generic Error Class to wrap any errors returned by MC2P-node
 */
function _Error() {
    this.populate.apply(this, arguments);
    this.stack = (new Error(this.message)).stack;
}

// Extend Native Error
_Error.prototype = Object.create(Error.prototype);

_Error.prototype.type = 'GenericError';
_Error.prototype.populate = function (type, message) {
    this.type = type;
    this.message = message;
};

_Error.extend = utils.protoExtend;

/**
 * Create subclass of internal Error klass
 * (Specifically for errors returned from MC2P's REST API)
 */
var MC2PError = _Error.MC2PError = _Error.extend({
    type: 'MC2PError',
    populate: function (raw) {
        // Move from prototype def (so it appears in stringified obj)
        this.type = raw.type;

        this.stack = (new Error(raw.message)).stack;
        this.rawType = raw.type;
        this.code = raw.code;
        this.param = raw.param;
        this.message = raw.message;
        this.detail = raw.detail;
        this.jsonBody = raw.jsonBody;
        this.resource = raw.resource;
        this.resourceId = raw.resourceId;
        this.raw = raw;
    }
});

/**
 * Helper factory which takes raw MC2P errors and outputs wrapping instances
 */
MC2PError.generate = function () {
    return new _Error('Generic', 'Unknown Error');
};

// Specific MC2P Error types:
_Error.InvalidRequestError = MC2PError.extend({type: 'InvalidRequestError'});
_Error.BadUseError = MC2PError.extend({type: 'BadUseError'});
_Error.ConnectionError = MC2PError.extend({type: 'ConnectionError'});
_Error.APIError = MC2PError.extend({type: 'APIError'});
