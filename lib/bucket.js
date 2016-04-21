'use strict';

var BucketManager = require('./bucketmgr');
var promisify = require('./promisify');

function Bucket(bucket) {
  if (!bucket) throw 'No native bucket was provided.';
  this._bucket = bucket;
}

Bucket.prototype = {
  get clientVersion() { return this._bucket.clientVersion; },

  get configThrottle() { return this._bucket.configThrottle; },
  set configThrottle(val) { this._bucket.configThrottle = val; },

  get connectionTimeout() { return this._bucket.connectionTimeout; },
  set connectionTimeout(val) { this._bucket.connectionTimeout = val; },

  get durabilityInterval() { return this._bucket.durabilityInterval; },
  set durabilityInterval(val) { this._bucket.durabilityInterval = val; },

  get durabilityTimeout() { return this._bucket.durabilityTimeout; },
  set durabilityTimeout(val) { this._bucket.durabilityTimeout = val; },

  get lcbVersion() { return this._bucket.lcbVersion; },

  get managementTimeout() { return this._bucket.managementTimeout; },
  set managementTimeout(val) { this._bucket.managementTimeout = val; },

  get nodeConnectionTimeout() { return this._bucket.nodeConnectionTimeout; },
  set nodeConnectionTimeout(val) { this.nodeConnectionTimeout = val; },

  get operationTimeout() { return this._bucket.operationTimeout; },
  set operationTimeout(val) { this._bucket.operationTimeout = val; },

  get viewTimeout() { return this._bucket.viewTimeout; },
  set viewTimeout(val) { this._bucket.viewTimeout = val; }
};

Bucket.prototype.append = function(key, fragment, options, callback) {
  return this._bucket.append(key, fragment, options, callback);
};

Bucket.prototype.appendAsync = function(key, fragment, options) {
  return promisify.call(this, this.append, key, fragment, options);
};

Bucket.prototype.counter = function(key, delta, options, callback) {
  return this._bucket.counter(key, delta, options, callback);
};

Bucket.prototype.counterAsync = function(key, delta, options) {
  return promisify.call(this, this.counter, key, delta, options);
};

Bucket.prototype.disconnect = function() {
  this._bucket.disconnect();
};

Bucket.prototype.enableN1ql = function(hosts) {
  this._bucket.enableN1ql(hosts);
};

Bucket.prototype.get = function(key, options, callback) {
  return this._bucket.get(key, options, callback);
};

Bucket.prototype.getAsync = function(key, options) {
  return promisify.call(this, this.get, key, options);
};

Bucket.prototype.getAndLock = function(key, options, callback) {
  return this._bucket.getAndLock(key, options, callback);
};

Bucket.prototype.getAndLockAsync = function(key, options) {
  return promisify.call(this, this.getAndLock, key, options);
};

Bucket.prototype.getAndTouch = function(key, expiry, options, callback) {
  return this._bucket.getAndTouch(key, expiry, options, callback);
};

Bucket.prototype.getAndTouchAsync = function(key, expiry, options) {
  return promisify.call(this, this.getAndTouch, key, expiry, options);
};

Bucket.prototype.getMulti = function(keys, callback) {
  return this._bucket.getMulti(keys, callback);
};

Bucket.prototype.getMultiAsync = function(keys) {
  return promisify.call(this, this.getMulti, keys);
};

Bucket.prototype.getReplica = function(key, options, callback) {
  return this._bucket.getReplica(key, options, callback);
};

Bucket.prototype.getReplicaAsync = function(key, options) {
  return promisify.call(this, this.getReplica, key, options);
};

Bucket.prototype.insert = function(key, value, options, callback) {
  return this._bucket.insert(key, value, options, callback);
};

Bucket.prototype.insertAsync = function(key, value, options) {
  return promisify.call(this, this.insert, key, value, options);
};

Bucket.prototype.manager = function() {
  return new BucketManager(this._bucket.manager());
};

Bucket.prototype.prepend = function(key, fragment, options, callback) {
  return this._bucket.prepend(key, fragment, options, callback);
};

Bucket.prototype.prependAsync = function(key, fragment, options) {
  return promisify.call(this, this.prepend, key, fragment, options);
};

Bucket.prototype.query = function(query, params, callback) {
  return this._bucket.query(query, params, callback);
};

Bucket.prototype.queryAsync = function(query, params) {
  return promisify.call(this, this.query, query, params);
};

Bucket.prototype.remove = function(key, options, callback) {
  return this._bucket.remove(key, options, callback);
};

Bucket.prototype.removeAsync = function(key, options) {
  return promisify.call(this, this.remove, key, options);
};

Bucket.prototype.replace = function(key, value, options, callback) {
  return this._bucket.replace(key, value, options, callback);
};

Bucket.prototype.replaceAsync = function(key, value, options) {
  return promisify.call(this, this.replace, key, value, options);
};

Bucket.prototype.setTranscoder = function(encoder, decoder) {
  this._bucket.setTranscoder(encoder, decoder);
};

Bucket.prototype.touch = function(key, expiry, options, callback) {
  return this._bucket.touch(key, expiry, options, callback);
};

Bucket.prototype.touchAsync = function(key, expiry, options) {
  return promisify.call(this, this.touch, key, expiry, options);
};

Bucket.prototype.unlock = function(key, cas, options, callback) {
  return this._bucket.unlock(key, cas, options, callback);
};

Bucket.prototype.unlockAsync = function(key, cas, options) {
  return promisify.call(this, this.unlock, key, cas, options);
};

Bucket.prototype.upsert = function(key, value, options, callback) {
  return this._bucket.upsert(key, value, options, callback);
};

Bucket.prototype.upsertAsync = function(key, value, options) {
  return promisify.call(this, this.upsert, key, value, options);
};

module.exports = Bucket;
