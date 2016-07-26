'use strict';

const promisify = require('./promisify');

const state = new WeakMap();
const me = (instance) => { return state.get(instance); };

class LookupInBuilder {
  constructor(builder) {
    if (typeof builder === 'undefined' || builder === null)
      throw new TypeError('No native LookupInBuilder was provided.');

    state.set(this, builder);
  }

  execute(callback) {
    me(this).execute(callback);
  }

  executeAsync() {
    return promisify.call(this, this.execute);
  }

  exists(path) {
    me(this).exists(path);
    return this;
  }

  get(path) {
    me(this).get(path);
    return this;
  }
}

module.exports = LookupInBuilder;
