'use strict';

var utils = require('./utils');
var Error = require('./Error');

var Notification = {
  DEFAULT_TOLERANCE: 300,

  constructEvent: function(payload) {
    return JSON.parse(payload);
  },
};

module.exports = Notification;