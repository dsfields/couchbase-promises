'use strict';

const Promise = require('bluebird');

const isFailure = require('./is-failure');

const promisify = function(original) {
  const method = original;
  const args = [];
  for (let i = 1; i < arguments.length; i++) {
    const arg = arguments[i];
    if (typeof arg === 'undefined') continue;
    args.push(arg);
  }
  const self = this;
  return new Promise((fulfill, reject) => {
    const ff = fulfill;
    const rej = reject;
    args.push(function (err, result) {
      if (isFailure(err)) {
        rej(err);
        return err;
      }
      let res = result;
      if (arguments.length > 2) {
        res = [ result ];
        for (let i = 2; i < arguments.length; i++) {
          const arg = arguments[i];
          res.push(arg);
        }
      }
      ff(res);
      return res;
    });
    method.apply(self, args);
  });
};

promisify.multiOp = function(original) {
  const method = original;
  const args = [];
  for (let i = 1; i < arguments.length; i++) {
    const arg = arguments[i];
    if (typeof arg === 'undefined') continue;
    args.push(arg);
  }
  const self = this;
  return new Promise((fulfill, reject) => {
    const ff = fulfill;
    args.push(function (err, result) {
      const val = {
        success: !isFailure(err),
        err: err,
        result: result
      };
      ff(val);
      return val;
    });
    method.apply(self, args);
  });
};

module.exports = promisify;
