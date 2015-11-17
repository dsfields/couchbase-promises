'use strict';

var couchbase = require('couchbase');

var Bucket = require('./bucket');
var ClusterManager = require('./clustermgr');
var promisify = require('./promisify');

function MockCluster(cnstr) {
  this._cluster = new couchbase.Mock.Cluster(cnstr);
}

MockCluster.prototype.manager = function(username, password) {
  return new ClusterManager(this._cluster.manager(username, password));
};

MockCluster.prototype.openBucket = function(name, password, callback) {
  return new Bucket(this._cluster.openBucket(name, password, callback));
};

MockCluster.prototype.openBucketAsync = function(name, password) {
  return promisify(this.openBucket, name, password);
};

module.exports = MockCluster;
