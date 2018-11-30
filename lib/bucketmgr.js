'use strict';

const { promisify } = require('./promises');


class BucketManager {

  constructor(bucketmgr) {
    const bmgr = bucketmgr;

    if (typeof bmgr === 'undefined' || bmgr === null) {
      throw new TypeError('No native bucket manager was provided.');
    }

    //
    // Add missing mock functions.  Super annoying I have to do this.  I'm
    // really hoping the Couchbase team fixes this.
    //

    if (typeof bmgr.buildDeferredIndexes !== 'function') {
      bmgr.buildDeferredIndexes = function (callback) {
        const cb = callback;
        setImmediate(() => {
          cb(null, true);
        });
      };
    }

    if (typeof bmgr.createIndex !== 'function') {
      bmgr.createIndex = function (indexName, fields, options, callback) {
        const cb = callback;
        setImmediate(() => {
          cb(null, true);
        });
      };
    }

    if (typeof bmgr.createPrimaryIndex !== 'function') {
      bmgr.createPrimaryIndex = function (options, callback) {
        const cb = callback;
        setImmediate(() => {
          cb(null, true);
        });
      };
    }

    if (typeof bmgr.dropIndex !== 'function') {
      bmgr.dropIndex = function (indexName, options, callback) {
        const cb = callback;
        setImmediate(() => {
          cb(null, true);
        });
      };
    }

    if (typeof bmgr.dropPrimaryIndex !== 'function') {
      bmgr.dropPrimaryIndex = function (options, callback) {
        const cb = callback;
        setImmediate(() => {
          cb(null, true);
        });
      };
    }

    if (typeof bmgr.getIndexes !== 'function') {
      bmgr.getIndexes = function (callback) {
        const cb = callback;
        setImmediate(() => {
          cb(null, true);
        });
      };
    }

    if (typeof bmgr.watchIndexes !== 'function') {
      bmgr.watchIndexes = function (watchList, options, callback) {
        const cb = callback;
        setImmediate(() => {
          cb(null, true);
        });
      };
    }

    this._bucketmgr = bmgr;
  }


  buildDeferredIndexes(callback) {
    return this._bucketmgr.buildDeferredIndexes(callback);
  }


  buildDeferredIndexesAsync() {
    return promisify.call(this, this.buildDeferredIndexes);
  }


  createIndex(indexName, fields, options, callback) {
    return this._bucketmgr.createIndex(indexName, fields, options, callback);
  }


  createIndexAsync(indexName, fields, options) {
    return promisify.call(this, this.createIndex, indexName, fields, options);
  }


  createPrimaryIndex(options, callback) {
    return this._bucketmgr.createPrimaryIndex(options, callback);
  }


  createPrimaryIndexAsync(options) {
    return promisify.call(this, this.createPrimaryIndex, options);
  }


  dropIndex(indexName, options, callback) {
    return this._bucketmgr.dropIndex(indexName, options, callback);
  }


  dropIndexAsync(indexName, options) {
    return promisify.call(this, this.dropIndex, indexName, options);
  }


  dropPrimaryIndex(options, callback) {
    return this._bucketmgr.dropPrimaryIndex(options, callback);
  }


  dropPrimaryIndexAsync(options, callback) {
    return promisify.call(this, this.dropPrimaryIndex, options, callback);
  }


  flush(callback) {
    return this._bucketmgr.flush(callback);
  }


  flushAsync() {
    return promisify.call(this, this.flush);
  }


  getDesignDocument(name, callback) {
    return this._bucketmgr.getDesignDocument(name, callback);
  }


  getDesignDocumentAsync(name) {
    return promisify.call(this, this.getDesignDocument, name);
  }


  getDesignDocuments(callback) {
    return this._bucketmgr.getDesignDocuments(callback);
  }


  getDesignDocumentsAsync() {
    return promisify.call(this, this.getDesignDocuments);
  }


  getIndexes(callback) {
    return this._bucketmgr.getIndexes(callback);
  }


  getIndexesAsync() {
    return promisify.call(this, this.getIndexes);
  }


  insertDesignDocument(name, data, callback) {
    return this._bucketmgr.insertDesignDocument(name, data, callback);
  }


  insertDesignDocumentAsync(name, data) {
    return promisify.call(this, this.insertDesignDocument, name, data);
  }


  removeDesignDocument(name, callback) {
    return this._bucketmgr.removeDesignDocument(name, callback);
  }


  removeDesignDocumentAsync(name) {
    return promisify.call(this, this.removeDesignDocument, name);
  }


  upsertDesignDocument(name, data, callback) {
    return this._bucketmgr.upsertDesignDocument(name, data, callback);
  }


  upsertDesignDocumentAsync(name, data) {
    return promisify.call(this, this.upsertDesignDocument, name, data);
  }


  watchIndexes(watchList, options, callback) {
    return this._bucketmgr.watchIndexes(watchList, options, callback);
  }


  watchIndexesAsync(watchList, options) {
    return promisify.call(this, this.watchIndexes, watchList, options);
  }

}

module.exports = BucketManager;
