'use strict';

var MC2PResource = require('../MC2PResource');
var mc2pResource = MC2PResource.method;

module.exports = MC2PResource.extend({

    list: mc2pResource({
        method: 'GET',
        path: 'sale/'
    }),

    get: mc2pResource({
        method: 'GET',
        path: 'sale/{resource_id}/',
        urlParams: ['resource_id'],
        required: ['resource_id']
    }),

    refund: mc2pResource({
        method: 'POST',
        path: 'sale/{resource_id}/refund/',
        urlParams: ['resource_id'],
        required: ['resource_id']
    }),

    capture: mc2pResource({
        method: 'POST',
        path: 'sale/{resource_id}/capture/',
        urlParams: ['resource_id'],
        required: ['resource_id']
    }),

    void: mc2pResource({
        method: 'POST',
        path: 'sale/{resource_id}/void/',
        urlParams: ['resource_id'],
        required: ['resource_id']
    })

});
