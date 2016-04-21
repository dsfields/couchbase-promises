'use strict';

const promisify = require('./promisify');

const state = new WeakMap();
const me = (instance) => { return state.get(instance); };

class LookupInBuilder {
  constructor(lookupInBuilder) {
    if (!lookupInBuilder)
      throw new Error('No native LookupInBuilder was provided.');
    state.set(this, lookupInBuilder);
  }

  execute(callback) {
    me(this).execute(callback);
  }

  executeAsync() {
    return promisify.call(this, this.execute);
  }

  exists(path) {
    return me(this).exists(path);
  }

  get(path) {
    return me(this).get(path);
  }
}

module.exports = LookupInBuilder;
