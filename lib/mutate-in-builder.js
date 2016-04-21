'use strict';

const promisify = require('./promisify');

const state = new WeakMap();
const me = (instance) => { return state.get(instance); };

class MutateInBuilder {
  constructor(mutateInBuilder) {
    if (!mutateInBuilder)
      throw new Error('No native MutateInBuilder was provided.');
    state.set(this, mutateInBuilder);
  }

  addUnique(path, value, createParents) {
    me(this).addUnique(path, value, createParents);
  }

  arrayInsert(path, value) {
    me(this).arrayInsert(path, value);
  }

  counter(path, delta, createParents) {
    me(this).counter(path, delta, createParents);
  }

  execute(callback) {
    me(this).execute(callback);
  }

  executeAsync() {
    return promisify.call(this, this.execute);
  }

  insert(path, value, createParents) {
    me(this).insert(path, value, createParents);
  }

  pushBack(path, value, createParents) {
    me(this).pushBack(path, value, createParents);
  }

  pushFront(path, value, createParents) {
    me(this).pushFront(path, value, createParents);
  }

  remove(path) {
    me(this).remove(path);
  }

  replace(path, value) {
    me(this).replace(path, value);
  }

  upsert(path, value, createParents) {
    me(this).upsert(path, value, createParents);
  }
}

module.exports = MutateInBuilder;
