'use strict';

const promisify = require('./promises').promisify;

const state = new WeakMap();
const me = (instance) => { return state.get(instance); };

class BucketManager {
  constructor(bucketmgr) {
    if (typeof bucketmgr === 'undefined' || bucketmgr === null )
      throw new TypeError('No native bucket manager was provided.');

    //
    // Add missing mock functions.  Super annoying I have to do this.  I'm
    // really hoping the Couchbase team fixes this, so I don't have to hack
    // around poor code.
    //

    if (typeof bucketmgr.buildDeferredIndexes !== 'function') {
      bucketmgr.buildDeferredIndexes = function(callback) {
        const cb = callback;
        process.nextTick(() => {
          cb(null, true);
        });
      };
    }

    if (typeof bucketmgr.createIndex !== 'function') {
      bucketmgr.createIndex = function(indexName, fields, options, callback) {
        const cb = callback;
        process.nextTick(() => {
          cb(null, true);
        });
      };
    }

    if (typeof bucketmgr.createPrimaryIndex !== 'function') {
      bucketmgr.createPrimaryIndex = function(options, callback) {
        const cb = callback;
        process.nextTick(() => {
          cb(null, true);
        });
      };
    }

    if (typeof bucketmgr.dropIndex !== 'function') {
      bucketmgr.dropIndex = function(indexName, options, callback) {
        const cb = callback;
        process.nextTick(() => {
          cb(null, true);
        });
      };
    }

    if (typeof bucketmgr.dropPrimaryIndex !== 'function') {
      bucketmgr.dropPrimaryIndex = function(options, callback) {
        const cb = callback;
        process.nextTick(() => {
          cb(null, true);
        });
      };
    }

    if (typeof bucketmgr.getIndexes !== 'function') {
      bucketmgr.getIndexes = function(callback) {
        const cb = callback;
        process.nextTick(() => {
          cb(null, true);
        });
      };
    }

    if (typeof bucketmgr.watchIndexes !== 'function') {
      bucketmgr.watchIndexes = function(watchList, options, callback) {
        const cb = callback;
        process.nextTick(() => {
          cb(null, true);
        });
      };
    }

    state.set(this, bucketmgr);
  }

  buildDeferredIndexes(callback) {
    return me(this).buildDeferredIndexes(callback);
  }

  buildDeferredIndexesAsync() {
    return promisify.call(this, this.buildDeferredIndexes);
  }

  createIndex(indexName, fields, options, callback) {
    return me(this).createIndex(indexName, fields, options, callback);
  }

  createIndexAsync(indexName, fields, options) {
    return promisify.call(this, this.createIndex, indexName, fields, options);
  }

  createPrimaryIndex(options, callback) {
    return me(this).createPrimaryIndex(options, callback);
  }

  createPrimaryIndexAsync(options, callback) {
    return promisify.call(this, this.createPrimaryIndex, options);
  }

  dropIndex(indexName, options, callback) {
    return me(this).dropIndex(indexName, options, callback);
  }

  dropIndexAsync(indexName, options) {
    return promisify.call(this, this.dropIndex, indexName, options);
  }

  dropPrimaryIndex(options, callback) {
    return me(this).dropPrimaryIndex(options, callback);
  }

  dropPrimaryIndexAsync(options, callback) {
    return promisify.call(this, this.dropPrimaryIndex, options, callback);
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

  getIndexes(callback) {
    return me(this).getIndexes(callback);
  }

  getIndexesAsync(callback) {
    return promisify.call(this, this.getIndexes);
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

  watchIndexes(watchList, options, callback) {
    return me(this).watchIndexes(watchList, options, callback);
  }

  watchIndexesAsync(watchList, options) {
    return promisify.call(this, this.watchIndexes, watchList, options);
  }
}

module.exports = BucketManager;
