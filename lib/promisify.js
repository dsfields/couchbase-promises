'use strict';

var Promise = require('bluebird');

module.exports = function(original) {
  var method = original;
  var args = [].slice.call(arguments);
  var self = this;
  return new Promise(function(fulfill, reject) {
    var ff = fulfill;
    var rej = reject;
    args.push(function(err, result) {
      if (err) rej(err); else ff(result);
      return result;
    });
    args.shift();
    method.apply(self, args);
  });
};
