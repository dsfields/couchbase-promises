'use strict';

const elv = require('elv');

const { promisify } = require('./promises');


class MutateInBuilder {

  constructor(mutateInBuilder) {
    if (!elv(mutateInBuilder)) {
      throw new TypeError('No native MutateInBuilder was provided.');
    }

    this._mutateInBuilder = mutateInBuilder;
  }


  arrayAddUnique(path, value, createParents) {
    this._mutateInBuilder.arrayAddUnique(path, value, createParents);
    return this;
  }


  arrayAppend(path, value, createParents) {
    this._mutateInBuilder.arrayAppend(path, value, createParents);
    return this;
  }


  arrayAppendAll(path, values, options) {
    this._mutateInBuilder.arrayAppendAll(path, values, options);
    return this;
  }


  arrayInsert(path, value) {
    this._mutateInBuilder.arrayInsert(path, value);
    return this;
  }


  arrayInsertAll(path, values, options) {
    this._mutateInBuilder.arrayInsertAll(path, values, options);
    return this;
  }


  arrayPrepend(path, value, createParents) {
    this._mutateInBuilder.arrayPrepend(path, value, createParents);
    return this;
  }


  arrayPrependAll(path, values, options) {
    this._mutateInBuilder.arrayPrependAll(path, values, options);
    return this;
  }


  counter(path, delta, createParents) {
    this._mutateInBuilder.counter(path, delta, createParents);
    return this;
  }


  execute(callback) {
    return this._mutateInBuilder.execute(callback);
  }


  executeAsync() {
    return promisify.call(this, this.execute);
  }


  insert(path, value, createParents) {
    this._mutateInBuilder.insert(path, value, createParents);
    return this;
  }


  remove(path) {
    this._mutateInBuilder.remove(path);
    return this;
  }


  replace(path, value) {
    this._mutateInBuilder.replace(path, value);
    return this;
  }


  upsert(path, value, createParents) {
    this._mutateInBuilder.upsert(path, value, createParents);
    return this;
  }

}

module.exports = MutateInBuilder;
