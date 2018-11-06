'use strict';

var MC2PResource = require('../MC2PResource');
var mc2pResource = MC2PResource.method;

module.exports = MC2PResource.extend({

    create: mc2pResource({
        method: 'POST',
        path: 'authorization/'
    }),

    list: mc2pResource({
        method: 'GET',
        path: 'authorization/'
    }),

    get: mc2pResource({
        method: 'GET',
        path: 'authorization/{resource_id}/',
        urlParams: ['resource_id'],
        required: ['resource_id']
    }),

    charge: mc2pResource({
        method: 'POST',
        path: 'authorization/{resource_id}/charge/',
        urlParams: ['resource_id'],
        required: ['resource_id']
    })

});
