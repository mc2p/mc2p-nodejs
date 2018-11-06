'use strict';

var MC2PResource = require('../MC2PResource');
var mc2pResource = MC2PResource.method;

module.exports = MC2PResource.extend({

    list: mc2pResource({
        method: 'GET',
        path: 'gateway/'
    }),

    get: mc2pResource({
        method: 'GET',
        path: 'gateway/{resource_id}/',
        urlParams: ['resource_id'],
        required: ['resource_id']
    })

});
