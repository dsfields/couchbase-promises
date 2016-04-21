'use strict';

const BucketManager = require('./bucketmgr');
const LookupInBuilder = require('./lookup-in-builder');
const MutateInBuilder = require('./mutate-in-builder');
const promisify = require('./promisify');

const state = new WeakMap();
const me = (instance) => { return state.get(instance); };

class Bucket {
  constructor(bucket) {
    if (!bucket)
      throw new Error('No native Bucket was provided.');
    state.set(this, bucket);
  }

  get clientVersion() { return me(this).clientVersion; }

  get configThrottle() { return me(this).configThrottle; }
  set configThrottle(val) { me(this).configThrottle = val; }

  get connectionTimeout() { return me(this).connectionTimeout; }
  set connectionTimeout(val) { me(this).connectionTimeout = val; }

  get durabilityInterval() { return me(this).durabilityInterval; }
  set durabilityInterval(val) { me(this).durabilityInterval = val; }

  get durabilityTimeout() { return me(this).durabilityTimeout; }
  set durabilityTimeout(val) { me(this).durabilityTimeout = val; }

  get lcbVersion() { return me(this).lcbVersion; }

  get managementTimeout() { return me(this).managementTimeout; }
  set managementTimeout(val) { me(this).managementTimeout = val; }

  get nodeConnectionTimeout() { return me(this).nodeConnectionTimeout; }
  set nodeConnectionTimeout(val) { this.nodeConnectionTimeout = val; }

  get operationTimeout() { return me(this).operationTimeout; }
  set operationTimeout(val) { me(this).operationTimeout = val; }

  get viewTimeout() { return me(this).viewTimeout; }
  set viewTimeout(val) { me(this).viewTimeout = val; }

  append(key, fragment, options, callback) {
    return me(this).append(key, fragment, options, callback);
  }

  appendAsync(key, fragment, options) {
    return promisify.call(this, this.append, key, fragment, options);
  }

  counter(key, delta, options, callback) {
    return me(this).counter(key, delta, options, callback);
  }

  counterAsync(key, delta, options) {
    return promisify.call(this, this.counter, key, delta, options);
  }

  disconnect() {
    me(this).disconnect();
  }

  enableN1ql(hosts) {
    me(this).enableN1ql(hosts);
  }

  get(key, options, callback) {
    return me(this).get(key, options, callback);
  }

  getAsync(key, options) {
    return promisify.call(this, this.get, key, options);
  }

  getAndLock(key, options, callback) {
    return me(this).getAndLock(key, options, callback);
  }

  getAndLockAsync(key, options) {
    return promisify.call(this, this.getAndLock, key, options);
  }

  getAndTouch(key, expiry, options, callback) {
    return me(this).getAndTouch(key, expiry, options, callback);
  }

  getAndTouchAsync(key, expiry, options) {
    return promisify.call(this, this.getAndTouch, key, expiry, options);
  }

  getMulti(keys, callback) {
    return me(this).getMulti(keys, callback);
  }

  getMultiAsync(keys) {
    return promisify.call(this, this.getMulti, keys);
  }

  getReplica(key, options, callback) {
    return me(this).getReplica(key, options, callback);
  }

  getReplicaAsync(key, options) {
    return promisify.call(this, this.getReplica, key, options);
  }

  insert(key, value, options, callback) {
    return me(this).insert(key, value, options, callback);
  }

  insertAsync(key, value, options) {
    return promisify.call(this, this.insert, key, value, options);
  }

  lookupIn(key, options) {
    return new LookupInBuilder(me(this).lookupIn(key, options));
  }

  manager() {
    return new BucketManager(me(this).manager());
  }

  mutateIn(key, options) {
    const mut = me(this).mutateIn(key, options);
    return new MutateInBuilder(mut);
  }

  prepend(key, fragment, options, callback) {
    return me(this).prepend(key, fragment, options, callback);
  }

  prependAsync(key, fragment, options) {
    return promisify.call(this, this.prepend, key, fragment, options);
  }

  query(query, params, callback) {
    return me(this).query(query, params, callback);
  }

  queryAsync(query, params) {
    return promisify.call(this, this.query, query, params);
  }

  remove(key, options, callback) {
    return me(this).remove(key, options, callback);
  }

  removeAsync(key, options) {
    return promisify.call(this, this.remove, key, options);
  }

  replace(key, value, options, callback) {
    return me(this).replace(key, value, options, callback);
  }

  replaceAsync(key, value, options) {
    return promisify.call(this, this.replace, key, value, options);
  }

  setTranscoder(encoder, decoder) {
    me(this).setTranscoder(encoder, decoder);
  }

  touch(key, expiry, options, callback) {
    return me(this).touch(key, expiry, options, callback);
  }

  touchAsync(key, expiry, options) {
    return promisify.call(this, this.touch, key, expiry, options);
  }

  unlock(key, cas, options, callback) {
    return me(this).unlock(key, cas, options, callback);
  }

  unlockAsync(key, cas, options) {
    return promisify.call(this, this.unlock, key, cas, options);
  }

  upsert(key, value, options, callback) {
    return me(this).upsert(key, value, options, callback);
  }

  upsertAsync(key, value, options) {
    return promisify.call(this, this.upsert, key, value, options);
  }
}

module.exports = Bucket;
