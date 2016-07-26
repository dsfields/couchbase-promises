'use strict';

const couchbase = require('couchbase');

const Bucket = require('./bucket');
const ClusterManager = require('./clustermgr');
const partials = require('./mock-partials');
const promisify = require('./promisify');

const state = new WeakMap();
const me = (instance) => { return state.get(instance); };

class MockCluster {
  constructor(cnstr) {
    const native = new couchbase.Mock.Cluster(cnstr);

    native.authenticate = function(auther) {};
    native.query = function(query, params, callback) {
      process.nextTick(() => {
        callback(null, true);
      });
    }

    state.set(this, native);
  }

  /* istanbul ignore next */
  authenticate(auther) {
    return me(this).authenticate(auther);
  }

  manager() {
    return new ClusterManager(me(this).manager());
  }

  openBucket(name, password, callback) {
    const args = [];
    for (let i = 0; i < arguments.length; i++) {
      const arg = arguments[i];
      if (typeof arg !== 'undefined') args.push(arg);
    }
    const cluster = me(this);
    const native = cluster.openBucket.apply(cluster, args);

    native.n1qlTimeout = 30000;

    native.lookupIn = function(key, options) {
      return new partials.LookupInBuilder(this, key);
    };

    native.mutateIn = function(key, options) {
      return new partials.MutateInBuilder(this, key);
    };

    return new Bucket(native);
  }

  query(query, params, callback) {
    return me(this).query(query, params, callback);
  }

  queryAsync(query, params) {
    return promisify.call(this, this.query, query, params);
  }
}

module.exports = MockCluster;
