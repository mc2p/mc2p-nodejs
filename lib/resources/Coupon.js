'use strict';

var MC2PResource = require('../MC2PResource');
var mc2pResource = MC2PResource.method;

module.exports = MC2PResource.extend({

    create: mc2pResource({
        method: 'POST',
        path: 'coupon/'
    }),

    list: mc2pResource({
        method: 'GET',
        path: 'coupon/'
    }),

    get: mc2pResource({
        method: 'GET',
        path: 'coupon/{resource_id}/',
        urlParams: ['resource_id'],
        required: ['resource_id']
    }),

    change: mc2pResource({
        method: 'PATCH',
        path: 'coupon/{resource_id}/',
        urlParams: ['resource_id'],
        required: ['resource_id']
    }),

    delete: mc2pResource({
        method: 'DELETE',
        path: 'coupon/{resource_id}/',
        urlParams: ['resource_id'],
        required: ['resource_id']
    })

});
