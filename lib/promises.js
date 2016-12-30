'use strict';

const Bluebird = require('bluebird');
const elv = require('elv');

const isFailure = require('./is-failure');

const msg = {
  noLib: 'Promise library cannot be null or undefined',
  noConstructor: 'No Promise constructor could be located in provided library',
  noAll: 'No all() method could be located in provided Promise library'
};

let Promise = Bluebird;
let library = Bluebird;

class Promises {
  static get Promise() { return Promise; }
  static get library() { return library; }

  static _setConstructor(lib) {
    if (typeof lib.Promise === 'function') {
      Promise = lib.Promise;
      return;
    }

    if (typeof lib === 'function') {
      Promise = lib;
      return;
    }

    throw new TypeError(msg.noConstructor);
  }

  static _setLibrary(lib) {
    if (typeof lib.all === 'function') {
      library = lib;
      return;
    }

    throw new TypeError(msg.noAll);
  }

  static set(lib) {
    if (!elv(lib)) throw new TypeError(msg.noLib);
    this._setConstructor(lib);
    this._setLibrary(lib);
  }

  static revert() {
    Promise = Bluebird;
    library = Bluebird;
  }

  static promisify(original) {
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
  }

  static promisifyMulti(original) {
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
  }
}

module.exports = Promises;
