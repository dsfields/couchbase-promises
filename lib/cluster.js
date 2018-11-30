'use strict';

const couchbase = require('couchbase');

const Bucket = require('./bucket');
const ClusterManager = require('./clustermgr');
const { promisify } = require('./promises');


class Cluster {

  constructor(cnstr, options) {
    this._cluster = new couchbase.Cluster(cnstr, options);
  }


  /* istanbul ignore next */
  authenticate(auther) {
    return this._cluster.authenticate(auther);
  }


  manager() {
    return new ClusterManager(this._cluster.manager());
  }


  openBucket(...args) {
    const oargs = [];
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (typeof arg !== 'undefined') oargs.push(arg);
    }
    const cluster = this._cluster;
    const native = cluster.openBucket.call(cluster, ...oargs);
    return new Bucket(native);
  }


  /* istanbul ignore next */
  query(query, params, callback) {
    return this._cluster.query(query, params, callback);
  }


  /* istanbul ignore next */
  queryAsync(query, params) {
    return promisify.call(this, this.query, query, params);
  }

}

module.exports = Cluster;
