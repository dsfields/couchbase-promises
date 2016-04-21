'use strict';

const Promise = require('bluebird');

module.exports = function(original) {
  const method = original;
  let args = new Array(arguments.length - 1);
  for (let i = 0; i < arguments.length; i++) {
    args[i] = arguments[i];
  }
  const self = this;
  return new Promise((fulfill, reject) => {
    const ff = fulfill;
    const rej = reject;
    args.push((err, result) => {
      if (err) rej(err); else ff(result);
      return result;
    });
    args.shift();
    method.apply(self, args);
  });
};
