'use strict';

const elv = require('elv');

const { promisify } = require('./promises');


class LookupInBuilder {

  constructor(builder) {
    if (!elv(builder)) {
      throw new TypeError('No native LookupInBuilder was provided.');
    }

    this._builder = builder;
  }


  execute(callback) {
    this._builder.execute(callback);
  }


  executeAsync() {
    return promisify.call(this, this.execute);
  }


  exists(path) {
    this._builder.exists(path);
    return this;
  }


  get(path) {
    this._builder.get(path);
    return this;
  }


  getCount(path, options) {
    this._builder.getCount(path, options);
    return this;
  }

}

module.exports = LookupInBuilder;
