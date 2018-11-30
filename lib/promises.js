'use strict';

const Bluebird = require('bluebird');
const elv = require('elv');

const isFailure = require('./is-failure');


const msg = {
  noLib: 'Promise library cannot be null or undefined',
  noConstructor: 'No Promise constructor could be located in provided library',
  noAll: 'No all() method could be located in provided Promise library',
};


let Promise = Bluebird;
let library = Bluebird;


class Promises {

  static get Promise() { return Promise; }


  static get library() { return library; }


  static _setConstructor(lib) {
    if (typeof lib.Promise === 'function') {
      /* eslint-disable prefer-destructuring */
      Promise = lib.Promise;
      /* eslint-enable prefer-destructuring */
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


  static promisify(...args) {
    const method = args[0];
    const margs = [];
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (typeof arg === 'undefined') continue;
      margs.push(arg);
    }
    return new Promise((fulfill, reject) => {
      const ff = fulfill;
      const rej = reject;
      margs.push((...cbArgs) => {
        const err = elv.tryGet(cbArgs, 0);
        if (isFailure(err)) {
          rej(err);
          return err;
        }
        let result = elv.tryGet(cbArgs, 1);
        if (cbArgs.length > 2) {
          result = [result];
          for (let i = 2; i < cbArgs.length; i++) {
            const arg = cbArgs[i];
            result.push(arg);
          }
        }
        ff(result);
        return result;
      });
      method.apply(this, margs);
    });
  }


  static promisifyNativeMulti(...args) {
    const method = elv.tryGet(args, 0);
    const margs = [];
    for (let i = 1; i < arguments.length; i++) {
      const arg = args[i];
      if (typeof arg === 'undefined') continue;
      margs.push(arg);
    }
    const self = this;
    return new Promise((fulfill, reject) => {
      const ff = fulfill;
      const rej = reject;
      margs.push((err, result) => {
        if (typeof err !== 'number' && isFailure(err)) {
          rej(err);
          return err;
        }
        const ecount = elv.coalesce(err, 0);
        const res = {
          hasErrors: ecount > 0,
          errors: ecount,
          results: result,
        };
        ff(res);
        return res;
      });
      method.apply(self, margs);
    });
  }


  static promisifyMulti(...args) {
    const method = elv.tryGet(args, 0);
    const margs = [];
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (typeof arg === 'undefined') continue;
      margs.push(arg);
    }
    const self = this;
    return new Promise((fulfill) => {
      const ff = fulfill;
      margs.push((err, result) => {
        const val = {
          success: !isFailure(err),
          err,
          result,
        };
        ff(val);
        return val;
      });
      method.apply(self, margs);
    });
  }

}

module.exports = Promises;
