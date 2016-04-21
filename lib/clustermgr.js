'use strict';

const promisify = require('./promisify');

const state = new WeakMap();
const me = (instance) => { return state.get(instance); };

class ClusterManager {
  constructor(clustermgr) {
    if (!clustermgr)
      throw new Error('No cluster manager was provided.');
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
