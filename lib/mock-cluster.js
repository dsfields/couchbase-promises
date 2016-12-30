'use strict';

const couchbase = require('couchbase');
const elv = require('elv');

const Bucket = require('./bucket');
const ClusterManager = require('./clustermgr');
const isFailure = require('./is-failure');
const partials = require('./mock-partials');
const promisify = require('./promises').promisify;

const state = new WeakMap();
const me = (instance) => { return state.get(instance); };

const lookupIn = function(key, options) {
  return new partials.LookupInBuilder(this, key);
};

const mutateIn = function(key, options) {
  return new partials.MutateInBuilder(this, key);
};

/* istanbul ignore next */
const listAppend = function(key, value, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  const self = this;
  this.get(key, (err, res) => {
    if (isFailure(err)) {
      if (elv(options) && options.createList) {
        const newList = [ value ];
        return self.insert(key, newList, (e, r) => {
          if (isFailure(e)) return cb(e);
          cb(undefined, { cas: r.cas, value: newList });
        });
      } else {
        return cb(err);
      }
    }

    if (!Array.isArray(res.value))
      return cb(new couchbase.Error('Not a list'));

    const val = res.value;
    val.push(value);

    self.replace(key, val, (e, r) => {
      if (elv(e)) return cb(e);
      cb(undefined, { cas: r.cas, value: val });
    });
  });
};

/* istanbul ignore next */
const listGet = function(key, index, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  this.get(key, (err, res) => {
    if (isFailure(err)) return cb(err);

    if (!Array.isArray(res.value))
      return cb(new couchbase.Error('Not a list'));

    if (index >= res.value.length)
      return cb(new couchbaseError('Index out of range'));

    cb(undefined, { cas: res.cas, value: res.value[index] });
  });
};

/* istanbul ignore next */
const listPrepend = function(key, value, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  const self = this;
  this.get(key, (err, res) => {
    if (isFailure(err)) {
      if (elv(options) && options.createList) {
        const newList = [ value ];
        return self.insert(key, newList, (e, r) => {
          if (isFailure(e)) return cb(e);
          cb(undefined, { cas: r.cas, value: newList });
        });
      } else {
        return cb(err);
      }
    }

    if (!Array.isArray(res.value))
      return cb(new couchbase.Error('Not a list'));

    const val = res.value;
    val.unshift(value);

    self.replace(key, val, (e, r) => {
      if (elv(e)) return cb(e);
      cb(undefined, { cas: r.cas, value: val });
    });
  });
};

/* istanbul ignore next */
const listRemove = function(key, index, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  const self = this;
  this.get(key, (err, res) => {
    if (isFailure(err)) return cb(err);

    if (!Array.isArray(res.value))
      return cb(new couchbase.Error('Not a list'));

    const val = res.value;

    if (index >= val.length)
      return cb(undefined, { cas: res.cas, value: val });

    val.splice(index, 1);

    self.replace(key, val, (e, r) => {
      if (elv(e)) return cb(e);
      cb(undefined, { cas: r.cas, value: val });
    });
  });
};

/* istanbul ignore next */
const listSet = function(key, index, value, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  const self = this;
  this.get(key, (err, res) => {
    if (isFailure(err)) {
      if (elv(options) && options.createList) {
        const newList = [ value ];
        return self.insert(key, newList, (e, r) => {
          if (isFailure(e)) return cb(e);
          cb(undefined, { cas: r.cas, value: newList });
        });
      } else {
        return cb(err);
      }
    }

    const val = res.value;

    if (!Array.isArray(res.value))
      return cb(new couchbase.Error('Not a list'));

    if (index >= val.length)
      return cb(new couchbaseError('Index out of range'));

    val[index] = value;

    self.replace(key, val, (e, r) => {
      if (elv(e)) return cb(e);
      cb(undefined, { cas: r.cas, value: val.length });
    });
  });
};

/* istanbul ignore next */
const listSize = function(key, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  this.get(key, (err, res) => {
    if (isFailure(err)) return cb(err);

    if (!Array.isArray(res.value))
      return cb(new couchbase.Error('Not a list'));

    cb(undefined, { cas: res.cas, value: res.value.length });
  });
};

/* istanbul ignore next */
const mapAdd = function(key, path, value, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  const self = this;
  this.get(key, (err, res) => {
    if (isFailure(err)) {
      if (elv(options) && options.createMap) {
        const newMap = { isMap: true };
        newMap[path] = value;
        return self.insert(key, newMap, (e, r) => {
          if (isFailure(e)) return cb(e);
          cb(undefined, { cas: r.cas, value: newMap });
        });
      } else {
        return cb(err);
      }
    }

    const val = res.value;

    if (!val.isMap)
      return cb(new couchbase.Error('Not a map'));

    val[path] = value;

    self.replace(key, val, (e, r) => {
      if (elv(e)) return cb(e);
      cb(undefined, { cas: r.cas, value: val });
    });
  });
};

/* istanbul ignore next */
const mapGet = function(key, path, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  this.get(key, (err, res) => {
    if (isFailure(err)) return cb(err);

    const val = res.value;

    if (!val.isMap)
      return cb(new couchbase.Error('Not a map'));

    if (!val.hasOwnProperty(path))
      return cb(new couchbaseError('Path invalid'));

    cb(undefined, { cas: res.cas, value: val[path] });
  });
};

/* istanbul ignore next */
const mapRemove = function(key, path, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  const self = this;
  this.get(key, (err, res) => {
    if (isFailure(err)) return cb(err);

    const val = res.value;

    if (!val.isMap)
      return cb(new couchbase.Error('Not a map'));

    if (!val.hasOwnProperty(path))
      return cb(undefined, { cas: res.cas, value: val });

    delete val[path];

    self.replace(key, val, (e, r) => {
      if (elv(e)) return cb(e);
      cb(undefined, { cas: r.cas, value: val });
    });
  });
};

/* istanbul ignore next */
const mapSize = function(key, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  this.get(key, (err, res) => {
    if (isFailure(err)) return cb(err);

    const val = res.value;

    if (!val.isMap)
      return cb(new couchbase.Error('Not a map'));

    cb(undefined, { cas: res.cas, value: Object.keys(val).length - 1 });
  });
};

/* istanbul ignore next */
const queuePop = function(key, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  const self = this;
  this.get(key, (err, res) => {
    if (isFailure(err)) return cb(err);

    if (!Array.isArray(res.value))
      return cb(new couchbase.Error('Not a queue'));

    const val = res.value;
    const next = val.shift();

    self.replace(key, val, (e, r) => {
      if (elv(e)) return cb(e);
      cb(undefined, { cas: r.cas, value: next });
    });
  });
};

/* istanbul ignore next */
const queuePush = function(key, value, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  const self = this;
  this.get(key, (err, res) => {
    if (isFailure(err)) {
      if (elv(options) && options.createQueue) {
        const newQueue = [ value ];
        return self.insert(key, newQueue, (e, r) => {
          if (isFailure(e)) return cb(e);
          cb(undefined, { cas: r.cas, value: newQueue });
        });
      } else {
        return cb(err);
      }
    }

    if (!Array.isArray(res.value))
      return cb(new couchbase.Error('Not a queue'));

    const val = res.value;
    val.push(value);

    self.replace(key, val, (e, r) => {
      if (elv(e)) return cb(e);
      cb(undefined, { cas: r.cas, value: val });
    });
  });
};

/* istanbul ignore next */
const queueSize = function(key, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  this.get(key, (err, res) => {
    if (isFailure(err)) return cb(err);

    const val = res.value;

    if (!Array.isArray(val))
      return cb(new couchbase.Error('Not a queue'));

    cb(undefined, { cas: res.cas, value: val.length });
  });
};

/* istanbul ignore next */
const setAdd = function(key, value, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  const self = this;
  this.get(key, (err, res) => {
    if (isFailure(err)) {
      if (elv(options) && options.createSet) {
        const newSet = [ value ];
        return self.insert(key, newSet, (e, r) => {
          if (isFailure(e)) return cb(e);
          cb(undefined, { cas: r.cas, value: newSet });
        });
      } else {
        return cb(err);
      }
    }

    const val = res.value;

    if (!Array.isArray(val))
      return cb(new couchbase.Error('Not a set'));

    if (!val.includes(value)) val.push(value);

    self.replace(key, val, (e, r) => {
      if (elv(e)) return cb(e);
      cb(undefined, { cas: r.cas, value: val });
    });
  });
};

/* istanbul ignore next */
const setExists = function(key, value, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  this.get(key, (err, res) => {
    if (isFailure(err)) return cb(err);

    const val = res.value;

    if (!Array.isArray(val))
      return cb(new couchbase.Error('Not a set'));

    cb(undefined, { cas: res.cas, value: val.includes(value) });
  });
};

/* istanbul ignore next */
const setRemove = function(key, value, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  const self = this;
  this.get(key, (err, res) => {
    if (isFailure(err)) return cb(err);

    let val = res.value;

    if (!Array.isArray(val))
      return cb(new couchbase.Error('Not a set'));

    const index = val.indexOf(value);

    if (index === -1)
      return cb(undefined, { cas: res.cas, value: val });

    delete val[index];

    self.replace(key, val, (e, r) => {
      if (elv(e)) return cb(e);
      cb(undefined, { cas: r.cas, value: val });
    });
  });
};

/* istanbul ignore next */
const setSize = function(key, options, callback) {
  const cb = (typeof options === 'function') ? options : callback;
  this.get(key, (err, res) => {
    if (isFailure(err)) return cb(err);

    const val =  res.value;

    if (!Array.isArray(val))
      return cb(new couchbase.Error('Not a set'));

    cb(undefined, { cas: res.cas, value: val.length });
  });
};

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

    /*
      SIGH
    */
    native.n1qlTimeout = 30000;
    native.lookupIn = lookupIn;
    native.mutateIn = mutateIn;
    native.listAppend = listAppend;
    native.listGet = listGet;
    native.listPrepend = listPrepend;
    native.listRemove = listRemove;
    native.listSet = listSet;
    native.listSize = listSize;
    native.mapAdd = mapAdd;
    native.mapGet = mapGet;
    native.mapRemove = mapRemove;
    native.mapSize = mapSize;
    native.queuePop = queuePop;
    native.queuePush = queuePush;
    native.queueSize = queueSize;
    native.setAdd = setAdd;
    native.setExists = setExists;
    native.setRemove = setRemove;
    native.setSize = setSize;

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
