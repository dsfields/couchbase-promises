'use strict';

const promisify = require('./promisify');

const state = new WeakMap();
const me = (instance) => { return state.get(instance); };

class BucketManager {
  constructor(bucketmgr) {
    if (!bucketmgr)
      throw new Error('No bucket manager was provided.');
    state.set(this, bucketmgr);
  }

  flush(callback) {
    return me(this).flush(callback);
  }

  flushAsync() {
    return promisify.call(this, this.flush);
  }

  getDesignDocument(name, callback) {
    return me(this).getDesignDocument(name, callback);
  }

  getDesignDocumentAsync(name) {
    return promisify.call(this, this.getDesignDocument, name);
  }

  getDesignDocuments(callback) {
    return me(this).getDesignDocuments(callback);
  }

  getDesignDocumentsAsync() {
    return promisify.call(this, this.getDesignDocuments);
  }

  insertDesignDocument(name, data, callback) {
    return me(this).insertDesignDocument(name, data, callback);
  }

  insertDesignDocumentAsync(name, data) {
    return promisify.call(this, this.insertDesignDocument, name, data);
  }

  removeDesignDocument(name, callback) {
    return me(this).removeDesignDocument(name, callback);
  }

  removeDesignDocumentAsync(name) {
    return promisify.call(this, this.removeDesignDocument, name);
  }

  upsertDesignDocument(name, data, callback) {
    return me(this).upsertDesignDocument(name, data, callback);
  }

  upsertDesignDocumentAsync(name, data) {
    return promisify.call(this, this.upsertDesignDocument, name, data);
  }
}

module.exports = BucketManager;
