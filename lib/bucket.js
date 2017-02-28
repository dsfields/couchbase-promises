'use strict';

const elv = require('elv');

const BucketManager = require('./bucketmgr');
const LookupInBuilder = require('./lookup-in');
const MutateInBuilder = require('./mutate-in');
const promises = require('./promises');

const promisify = promises.promisify;
const promisifyMulti = promises.promisifyMulti;
const promisifyNativeMulti = promises.promisifyNativeMulti;

const state = new WeakMap();
const me = (instance) => { return state.get(instance); };

const isPojo = function(obj) {
  return (typeof obj === 'object'
          && !Array.isArray(obj)
          && !(obj instanceof Date)
          && obj !== null);
};

const summarize = function(keys, results) {
  const summary = {
    keys: [],
    results: {},
    hasErrors: false
  };

  for (let i = 0; i < results.length; i++) {
    const key = keys[i];
    const item = results[i];
    summary.keys.push(key);
    summary.results[key] = item;
    summary.hasErrors = summary.hasErrors || !item.success;
  }
  return summary;
};

const getOptions = function(entry, options) {
  if (!entry.hasOwnProperty('options')) return Object.assign({}, options);
  if (typeof entry.options === 'undefined') return undefined;
  if (isPojo(entry.options)) return entry.options;
  throw new TypeError('Invalid options value: options must be an object');
};

const multiDocsOp = function(op, docs, options, params) {
  const isMap = (docs instanceof Map);

  if (!isPojo(docs) && !isMap)
    throw new TypeError('Argument "docs" must be an object or Map.');

  const keys = (isMap)
    ? Array.from(docs.keys())
    : Object.keys(docs);

  const todo = [];
  const bucket = me(this);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const args = [ op, key ];
    const entry = (isMap) ? docs.get(key) : docs[key];

    if (!isPojo(entry))
      throw new TypeError('Docs entry must be an object');

    for (let h = 0; h < params.length; h++) {
      const name = params[h];
      const val = (name === 'options')
        ? getOptions(entry, options)
        : entry[name];

      if (typeof val !== 'undefined') args.push(val);
    }

    const task = promisifyMulti.apply(this, args);
    todo.push(task);
  }

  return promises.library.all(todo).then((res) => {
    return summarize(keys, res);
  });
};

const multiKeysOp = function(op, keys, options) {
  if (!Array.isArray(keys)
      && !(keys instanceof Set)
      && !(keys instanceof Map)
  )
    throw new TypeError('Argument "keys" must be an array, Set, or Map.');

  const todo = [];
  const bucket = me(this);
  const found = new Set();

  keys.forEach((key, value, collection) => {
    if (found.has(key)) return;
    const o = (elv(value)) ? elv.coalesce(value.options, options) : undefined;
    const task = promisifyMulti.call(this, op, key, o);
    todo.push(task);
    found.add(key);
  });

  return promises.library.all(todo).then((res) => {
    return summarize(keys, res);
  });
};

class Bucket {
  constructor(bucket) {
    if (!elv(bucket))
      throw new TypeError('No native Bucket was provided.');

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

  get n1qlTimeout() { return me(this).n1qlTimeout; }
  set n1qlTimeout(val) { me(this).n1qlTimeout = val; }

  get nodeConnectionTimeout() { return me(this).nodeConnectionTimeout; }
  set nodeConnectionTimeout(val) { me(this).nodeConnectionTimeout = val; }

  get operationTimeout() { return me(this).operationTimeout; }
  set operationTimeout(val) { me(this).operationTimeout = val; }

  get viewTimeout() { return me(this).viewTimeout; }
  set viewTimeout(val) { me(this).viewTimeout = val; }

  addListener(eventName, listener) {
    me(this).addListener(eventName, listener);
    return this;
  }

  append(key, fragment, options, callback) {
    return me(this).append(key, fragment, options, callback);
  }

  appendAsync(key, fragment, options) {
    return promisify.call(this, this.append, key, fragment, options);
  }

  appendMultiAsync(docs, options) {
    const params = ['fragment', 'options'];
    return multiDocsOp.call(this, this.append, docs, options, params);
  }

  counter(key, delta, options, callback) {
    return me(this).counter(key, delta, options, callback);
  }

  counterAsync(key, delta, options) {
    return promisify.call(this, this.counter, key, delta, options);
  }

  counterMultiAsync(docs, options) {
    const params = ['delta', 'options'];
    return multiDocsOp.call(this, this.counter, docs, options, params);
  }

  disconnect() {
    return me(this).disconnect();
  }

  emit(eventName) {
    const args = [ eventName ];
    for (let i = 1; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    const bucket = me(this);
    bucket.emit.apply(bucket, args);

    return this;
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

  getAndLockMultiAsync(keys, options) {
    return multiKeysOp.call(this, this.getAndLock, keys, options);
  }

  getAndTouch(key, expiry, options, callback) {
    return me(this).getAndTouch(key, expiry, options, callback);
  }

  getAndTouchAsync(key, expiry, options) {
    return promisify.call(this, this.getAndTouch, key, expiry, options);
  }

  getAndTouchMultiAsync(docs, options) {
    const params = ['expiry', 'options'];
    return multiDocsOp.call(this, this.getAndTouch, docs, options, params);
  }

  getMaxListeners() {
    return me(this).getMaxListeners();
  }

  getMulti(keys, callback) {
    return me(this).getMulti(keys, callback);
  }

  getMultiAsync(keys, options) {
    return promisifyNativeMulti.call(this, this.getMulti, keys, options);
  }

  getReplica(key, options, callback) {
    return me(this).getReplica(key, options, callback);
  }

  getReplicaAsync(key, options) {
    return promisify.call(this, this.getReplica, key, options);
  }

  getReplicaMultiAsync(keys, options) {
    return multiKeysOp.call(this, this.getReplica, keys, options);
  }

  insert(key, value, options, callback) {
    return me(this).insert(key, value, options, callback);
  }

  insertAsync(key, value, options) {
    return promisify.call(this, this.insert, key, value, options);
  }

  insertMultiAsync(docs, options) {
    const params = ['value', 'options'];
    return multiDocsOp.call(this, this.insert, docs, options, params);
  }

  listAppend(key, value, options, callback) {
    return me(this).listAppend(key, value, options, callback);
  }

  listAppendAsync(key, value, options) {
    return promisify.call(this, this.listAppend, key, value, options);
  }

  listAppendMultiAsync(keys, options) {
    const params = ['value', 'options'];
    return multiDocsOp.call(this, this.listAppend, keys, options, params);
  }

  listGet(key, index, options, callback) {
    return me(this).listGet(key, index, options, callback);
  }

  listGetAsync(key, index, options) {
    return promisify.call(this, this.listGet, key, index, options);
  }

  listGetMultiAsync(keys, options) {
    const params = ['index', 'options'];
    return multiDocsOp.call(this, this.listGet, keys, options, params);
  }

  listenerCount(eventName) {
    return me(this).listenerCount(eventName);
  }

  listeners(eventName) {
    return me(this).listeners(eventName);
  }

  listPrepend(key, value, options, callback) {
    return me(this).listPrepend(key, value, options, callback);
  }

  listPrependAsync(key, value, options) {
    return promisify.call(this, this.listPrepend, key, value, options);
  }

  listPrependMultiAsync(keys, options) {
    const params = ['value', 'options'];
    return multiDocsOp.call(this, this.listPrepend, keys, options, params);
  }

  listRemove(key, index, options, callback) {
    return me(this).listRemove(key, index, options, callback);
  }

  listRemoveAsync(key, index, options) {
    return promisify.call(this, this.listRemove, key, index, options);
  }

  listRemoveMultiAsync(keys, options) {
    const params = ['index', 'options'];
    return multiDocsOp.call(this, this.listRemove, keys, options, params);
  }

  listSet(key, index, value, options, callback) {
    return me(this).listSet(key, index, value, options, callback);
  }

  listSetAsync(key, index, value, options) {
    return promisify.call(this, this.listSet, key, index, value, options);
  }

  listSetMultiAsync(keys, options) {
    const params = ['index', 'value', 'options'];
    return multiDocsOp.call(this, this.listSet, keys, options, params);
  }

  listSize(key, options, callback) {
    return me(this).listSize(key, options, callback);
  }

  listSizeAsync(key, options) {
    return promisify.call(this, this.listSize, key, options);
  }

  listSizeMultiAsync(keys, options) {
    return multiKeysOp.call(this, this.listSize, keys, options);
  }

  lookupIn(key, options) {
    const look = me(this).lookupIn(key, options);
    return new LookupInBuilder(look);
  }

  manager() {
    return new BucketManager(me(this).manager());
  }

  mapAdd(key, path, value, options, callback) {
    return me(this).mapAdd(key, path, value, options, callback);
  }

  mapAddAsync(key, path, value, options) {
    return promisify.call(this, this.mapAdd, key, path, value, options);
  }

  mapAddMultiAsync(keys, options) {
    const params = ['path', 'value', 'options'];
    return multiDocsOp.call(this, this.mapAdd, keys, options, params);
  }

  mapGet(key, path, options, callback) {
    return me(this).mapGet(key, path, options, callback);
  }

  mapGetAsync(key, path, options) {
    return promisify.call(this, this.mapGet, key, path, options);
  }

  mapGetMultiAsync(keys, options) {
    const params = ['path', 'options'];
    return multiDocsOp.call(this, this.mapGet, keys, options, params);
  }

  mapRemove(key, path, options, callback) {
    return me(this).mapRemove(key, path, options, callback);
  }

  mapRemoveAsync(key, path, options) {
    return promisify.call(this, this.mapRemove, key, path, options);
  }

  mapRemoveMultiAsync(keys, options) {
    const params = ['path', 'options'];
    return multiDocsOp.call(this, this.mapRemove, keys, options, params);
  }

  mapSize(key, options, callback) {
    return me(this).mapSize(key, options, callback);
  }

  mapSizeAsync(key, options) {
    return promisify.call(this, this.mapSize, key, options);
  }

  mapSizeMultiAsync(keys, options) {
    return multiKeysOp.call(this, this.mapSize, keys, options);
  }

  mutateIn(key, options) {
    const mut = me(this).mutateIn(key, options);
    return new MutateInBuilder(mut);
  }

  on(eventName, listener) {
    me(this).on(eventName, listener);
    return this;
  }

  once(eventName, listener) {
    me(this).once(eventName, listener);
    return this;
  }

  prepend(key, fragment, options, callback) {
    return me(this).prepend(key, fragment, options, callback);
  }

  prependAsync(key, fragment, options) {
    return promisify.call(this, this.prepend, key, fragment, options);
  }

  prependMultiAsync(keys, options) {
    const params = ['fragment', 'options'];
    return multiDocsOp.call(this, this.prepend, keys, options, params);
  }

  query(query, params, callback) {
    return me(this).query(query, params, callback);
  }

  queryAsync(query, params) {
    return promisify.call(this, this.query, query, params);
  }

  queuePop(key, options, callback) {
    return me(this).queuePop(key, options, callback);
  }

  queuePopAsync(key, options) {
    return promisify.call(this, this.queuePop, key, options);
  }

  queuePopMultiAsync(keys, options) {
    return multiKeysOp.call(this, this.queuePop, keys, options);
  }

  queuePush(key, value, options, callback) {
    return me(this).queuePush(key, value, options, callback);
  }

  queuePushAsync(key, value, options) {
    return promisify.call(this, this.queuePush, key, value, options);
  }

  queuePushMultiAsync(keys, options) {
    const params = ['value', 'options'];
    return multiDocsOp.call(this, this.queuePush, keys, options, params);
  }

  queueSize(key, options, callback) {
    return me(this).queueSize(key, options, callback);
  }

  queueSizeAsync(key, options) {
    return promisify.call(this, this.queueSize, key, options);
  }

  queueSizeMultiAsync(keys, options) {
    return multiKeysOp.call(this, this.queueSize, keys, options);
  }

  remove(key, options, callback) {
    return me(this).remove(key, options, callback);
  }

  removeAsync(key, options) {
    return promisify.call(this, this.remove, key, options);
  }

  removeMultiAsync(keys, options) {
    return multiKeysOp.call(this, this.remove, keys, options);
  }

  removeAllListeners(eventName) {
    me(this).removeAllListeners(eventName);
    return this;
  }

  removeListener(eventName, listener) {
    me(this).removeListener(eventName, listener);
    return this;
  }

  replace(key, value, options, callback) {
    return me(this).replace(key, value, options, callback);
  }

  replaceAsync(key, value, options) {
    return promisify.call(this, this.replace, key, value, options);
  }

  replaceMultiAsync(docs, options) {
    const params = ['value', 'options'];
    return multiDocsOp.call(this, this.replace, docs, options, params);
  }

  setAdd(key, value, options, callback) {
    return me(this).setAdd(key, value, options, callback);
  }

  setAddAsync(key, value, options) {
    return promisify.call(this, this.setAdd, key, value, options);
  }

  setAddMultiAsync(keys, options) {
    const params = ['value', 'options'];
    return multiDocsOp.call(this, this.setAdd, keys, options, params);
  }

  setExists(key, value, options, callback) {
    return me(this).setExists(key, value, options, callback);
  }

  setExistsAsync(key, value, options) {
    return promisify.call(this, this.setExists, key, value, options);
  }

  setExistsMultiAsync(keys, options) {
    const params = ['value', 'options'];
    return multiDocsOp.call(this, this.setExists, keys, options, params);
  }

  setMaxListeners(n) {
    me(this).setMaxListeners(n);
    return this;
  }

  setRemove(key, value, options, callback) {
    return me(this).setRemove(key, value, options, callback);
  }

  setRemoveAsync(key, value, options) {
    return promisify.call(this, this.setRemove, key, value, options);
  }

  setRemoveMultiAsync(keys, options) {
    const params = ['value', 'options'];
    return multiDocsOp.call(this, this.setRemove, keys, options, params);
  }

  setSize(key, options, callback) {
    return me(this).setSize(key, options, callback);
  }

  setSizeAsync(key, options) {
    return promisify.call(this, this.setSize, key, options);
  }

  setSizeMultiAsync(keys, options) {
    return multiKeysOp.call(this, this.setSize, keys, options);
  }

  /* istanbul ignore next */
  setTranscoder(encoder, decoder) {
    return me(this).setTranscoder(encoder, decoder);
  }

  touch(key, expiry, options, callback) {
    return me(this).touch(key, expiry, options, callback);
  }

  touchAsync(key, expiry, options) {
    return promisify.call(this, this.touch, key, expiry, options);
  }

  touchMultiAsync(keys, options) {
    const params = ['expiry', 'options'];
    return multiDocsOp.call(this, this.touch, keys, options, params);
  }

  unlock(key, cas, options, callback) {
    return me(this).unlock(key, cas, options, callback);
  }

  unlockAsync(key, cas, options) {
    return promisify.call(this, this.unlock, key, cas, options);
  }

  unlockMultiAsync(keys, options) {
    const params = ['cas', 'options'];
    return multiDocsOp.call(this, this.unlock, keys, options, params);
  }

  upsert(key, value, options, callback) {
    return me(this).upsert(key, value, options, callback);
  }

  upsertAsync(key, value, options) {
    return promisify.call(this, this.upsert, key, value, options);
  }

  upsertMultiAsync(docs, options) {
    const params = ['value', 'options'];
    return multiDocsOp.call(this, this.upsert, docs, options, params);
  }
}

module.exports = Bucket;
