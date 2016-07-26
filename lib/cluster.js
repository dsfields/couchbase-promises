'use strict';

const couchbase = require('couchbase');

const Bucket = require('./bucket');
const ClusterManager = require('./clustermgr');

const state = new WeakMap();
const me = (instance) => { return state.get(instance); };

class Cluster {
  constructor(cnstr, options) {
    state.set(this, new couchbase.Cluster(cnstr, options));
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
    return new Bucket(native);
  }

  /* istanbul ignore next */
  query(query, params, callback) {
    return me(this).query(query, params, callback);
  }

  /* istanbul ignore next */
  queryAsync(query, params) {
    return promisify.call(this, this.query, query, params);
  }
}

module.exports = Cluster;
