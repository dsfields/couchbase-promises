'use strict';

const promisify = require('./promisify');

const state = new WeakMap();
const me = (instance) => { return state.get(instance); };

class ClusterManager {
  constructor(clustermgr, isMock) {
    if (typeof clustermgr === 'undefined' || clustermgr === null )
      throw new TypeError('No native cluster manager was provided.');

    //
    // Add missing mock functions.  Super annoying I have to do this.  I'm
    // really hoping the Couchbase team fixes this, so I don't have to hack
    // around poor code.
    //

    if (typeof clustermgr.createBucket !== 'function') {
      clustermgr.createBucket = function(name, opts, callback) {
        process.nextTick(() => {
          callback(null, true);
        })
      }
    }

    if (typeof clustermgr.removeBucket !== 'function') {
      clustermgr.removeBucket = function(name, callback) {
        process.nextTick(() => {
          callback(null, true);
        })
      }
    }

    state.set(this, clustermgr);
  }

  createBucket(name, opts, callback) {
    return me(this).createBucket(name, opts, callback);
  }

  createBucketAsync(name, opts) {
    return promisify.call(this, this.createBucket, name, opts);
  }

  listBuckets(callback) {
    return me(this).listBuckets(callback);
  }

  listBucketsAsync() {
    return promisify.call(this, this.listBuckets);
  }

  removeBucket(name, callback) {
    return me(this).removeBucket(name, callback);
  }

  removeBucketAsync(name) {
    return promisify.call(this, this.removeBucket, name);
  }
}

module.exports = ClusterManager;
