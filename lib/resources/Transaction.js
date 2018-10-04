'use strict';

var MC2PResource = require('../MC2PResource');
var mc2pResource = MC2PResource.method;

module.exports = MC2PResource.extend({

    create: mc2pResource({
        method: 'POST',
        path: 'transaction/'
    }),

    list: mc2pResource({
        method: 'GET',
        path: 'transaction/'
    }),

    detail: mc2pResource({
        method: 'GET',
        path: 'transaction/{resource_id}/',
        urlParams: ['resource_id'],
        required: ['resource_id']
    })

});
