'use strict';

var MC2PResource = require('../MC2PResource');
var mc2pResource = MC2PResource.method;

module.exports = MC2PResource.extend({

    create: mc2pResource({
        method: 'POST',
        path: 'subscription/'
    }),

    list: mc2pResource({
        method: 'GET',
        path: 'subscription/'
    }),

    detail: mc2pResource({
        method: 'GET',
        path: 'subscription/{resource_id}/',
        urlParams: ['resource_id'],
        required: ['resource_id']
    })

});
