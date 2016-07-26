'use strict';

const promisify = require('./promisify');

const state = new WeakMap();
const me = (instance) => { return state.get(instance); };

class MutateInBuilder {
  constructor(mutateInBuilder) {
    if (!mutateInBuilder)
      throw new TypeError('No native MutateInBuilder was provided.');

    state.set(this, mutateInBuilder);
  }

  arrayAddUnique(path, value, createParents) {
    me(this).arrayAddUnique(path, value, createParents);
    return this;
  }

  arrayAppend(path, value, createParents) {
    me(this).arrayAppend(path, value, createParents);
    return this;
  }

  arrayInsert(path, value) {
    me(this).arrayInsert(path, value);
    return this;
  }

  arrayPrepend(path, value, createParents) {
    me(this).arrayPrepend(path, value, createParents);
    return this;
  }

  counter(path, delta, createParents) {
    me(this).counter(path, delta, createParents);
    return this;
  }

  insert(path, value, createParents) {
    me(this).insert(path, value, createParents);
    return this;
  }

  remove(path) {
    me(this).remove(path);
    return this;
  }

  replace(path, value) {
    me(this).replace(path, value);
    return this;
  }

  upsert(path, value, createParents) {
    me(this).upsert(path, value, createParents);
    return this;
  }

  execute(callback) {
    me(this).execute(callback);
  }

  executeAsync() {
    return promisify.call(this, this.execute);
  }

  // deprecated

  addUnique(path, value, createParents) {
    me(this).addUnique(path, value, createParents);
    return this;
  }

  pushBack(path, value, createParents) {
    me(this).pushBack(path, value, createParents);
    return this;
  }

  pushFront(path, value, createParents) {
    me(this).pushFront(path, value, createParents);
    return this;
  }
}

module.exports = MutateInBuilder;
