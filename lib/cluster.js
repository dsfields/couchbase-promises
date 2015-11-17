'use strict';

var couchbase = require('couchbase');

var Bucket = require('./bucket');
var ClusterManager = require('./clustermgr');
var promisify = require('./promisify');

function Cluster(cnstr, options) {
  this._cluster = new couchbase.Cluster(cnstr, options);
}

Cluster.prototype.manager = function(username, password) {
  return new ClusterManager(this._cluster.manager(username, password));
};

Cluster.prototype.openBucket = function(name, password, callback) {
  return new Bucket(this._cluster.openBucket(name, password, callback));
};

Cluster.prototype.openBucketAsync = function(name, password) {
  return promisify(this.openBucket, name, password);
};

module.exports = Cluster;
