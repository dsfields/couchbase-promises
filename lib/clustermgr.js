'use strict';

var promisify = require('./promisify');

function ClusterManager(clustermgr) {
  if (!clustermgr) throw 'No cluster manager was provided.';
  this._clustermgr = clustermgr;
}

ClusterManager.prototype.createBucket = function(name, opts, callback) {
  return this._clustermgr.createBucket(name, opts, callback);
};

ClusterManager.prototype.createBucketAsync = function(name, opts) {
  return promisify(this.createBucket, name, opts);
};

ClusterManager.prototype.listBuckets = function(callback) {
  return this._clustermgr.listBuckets(callback);
};

ClusterManager.prototype.listBucketsAsync = function() {
  return promisify(this.listBuckets);
};

ClusterManager.prototype.removeBucket = function(name, callback) {
  return this._clustermgr.removeBucket(name, callback);
};

ClusterManager.prototype.removeBucketAsync = function(name) {
  return promisify(this.removeBucket, name);
};

module.exports = ClusterManager;
