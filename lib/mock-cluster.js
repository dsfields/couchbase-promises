'use strict';

const couchbase = require('couchbase');

const Bucket = require('./bucket');
const ClusterManager = require('./clustermgr');
const promisify = require('./promisify');

const state = new WeakMap();
const me = (instance) => { return state.get(instance); };

class MockCluster {
  constructor(cnstr) {
    state.set(this, new couchbase.Mock.Cluster(cnstr));
  }

  manager(username, password) {
    return new ClusterManager(me(this).manager(username, password));
  }

  openBucket(name, password, callback) {
    return new Bucket(me(this).openBucket(name, password, callback));
  }

  openBucketAsync(name, password) {
    return promisify.call(this, this.openBucket, name, password);
  }
}

module.exports = MockCluster;
