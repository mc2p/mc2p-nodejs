'use strict';

var MC2PResource = require('../MC2PResource');
var mc2pResource = MC2PResource.method;

module.exports = MC2PResource.extend({

    get: mc2pResource({
        method: 'GET',
        path: 'pay/{resource_id}/',
        urlParams: ['resource_id'],
        required: ['resource_id']
    }),

    card: mc2pResource({
        method: 'POST',
        path: 'pay/{resource_id}/card/{gateway_code}/',
        urlParams: ['resource_id', 'gateway_code'],
        required: ['resource_id', 'gateway_code']
    }),

    share: mc2pResource({
        method: 'POST',
        path: 'pay/{resource_id}/share/',
        urlParams: ['resource_id'],
        required: ['resource_id']
    })

});
