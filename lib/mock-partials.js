/* istanbul ignore next */

'use strict';

const isFailure = require('./is-failure');

const hasKey = function(obj, key) {
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === key) return true;
  }
  return false;
};

const assertObj = function(obj) {
  if (typeof obj !== 'object' || obj === null)
    throw new TypeError('Document must be an object');
};

const assertPath = function(path) {
  if (typeof path !== 'string')
    throw new TypeError('A "path" must be a string');
};

const assertCreateParents = function(createParents) {
  const type = typeof createParents;
  if (type !== 'boolean' && type !== 'undefined')
    throw new TypeError('Argument "createParents" must be a Boolean');
};

const assertIndex = function(index) {
  if (typeof index !== 'number')
    throw new TypeError('Argument "index" must be numeric');
}

const assertDelta = function(delta) {
  if (typeof delta !== 'number')
    throw new TypeError('Argument "delta" must be numeric');
};

const assertCallback = function(callback) {
  if (typeof callback !== 'function')
    throw new TypeError('Argument "callback" must be a function');
};

const assertBucket = function(bucket) {
  if (typeof bucket === 'undefined' || bucket === null)
    throw new TypeError('Argument "bucket" must have a value');
};

const assertLeaf = function(leaf, path) {
  if (typeof leaf === 'undefined')
    throw new TypeError(`One or more nodes in the path "${path}" do not exist`);
};

const assertKey = function(key) {
  if (typeof key !== 'string')
    throw new TypeError('Agument "key" must be a string');
};

const assertArray = function(array, key) {
  if (!Array.isArray(array))
    throw new TypeError(`Property "${key}" is not an array`);
};

const assertCounter = function(value, key) {
  if (typeof value !== 'number')
    throw new TypeError(`Property ${key} is not a numeric`);
}

const getLeaf = function(obj, path, createParents) {
  assertObj(obj);
  assertPath(path);
  assertCreateParents(createParents);

  const parts = path.split('.');
  let key;
  let next = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    key = parts[i];
    if (hasKey(next, key)) {
      const val = next[key];

      if (typeof val !== 'object')
        throw new TypeError('Targeted parent key is not an object.');

      if (val === null) {
        if (createParents) next[key] = {};
        else return undefined;
      }
    } else if (createParents) {
      next[key] = {};
    } else {
      return undefined;
    }

    next = next[key];
  }

  return {
    key: key,
    container: next
  };
};

const arrayAddUnique = function(obj, path, value, createParents) {
  const leaf = getLeaf(obj, path, createParents);
  assertLeaf(leaf, path);
  assertArray(leaf.container[leaf.key], leaf.key);
  if (!leaf.container[leaf.key].includes(value))
    leaf.container[leaf.key].push(value);
};

const arrayAppend = function(obj, path, value, createParents) {
  const leaf = getLeaf(obj, path, false);
  assertLeaf(leaf, path);
  assertArray(leaf.container[leaf.key], leaf.key);
  leaf.container[leaf.key].push(value);
};

const arrayInsert = function(obj, path, value) {
  const leaf = getLeaf(obj, path, false);
  assertLeaf(leaf, path);
  if (hasKey(leaf.container, leaf.key)) {
    assertArray(leaf.container[leaf.key], leaf.key);
    leaf.container[leaf.key].push(value);
  } else {
    leaf.container[leaf.key] = [ value ];
  }
};

const arrayPrepend = function(obj, path, value, createParents) {
  const leaf = getLeaf(obj, path, createParents);
  assertLeaf(leaf, path);
  assertArray(leaf.container[leaf.key], leaf.key);
  leaf.container[leaf.key].unshift(value);
};

const counter = function(obj, path, delta, createParents) {
  const leaf = getLeaf(obj, path, createParents);
  assertLeaf(leaf, path);
  assertCounter(leaf.container[leaf.key], leaf.key);
  leaf.container[leaf.key] += delta;
};

const insert = function(obj, path, value, createParents) {
  const leaf = getLeaf(obj, path, createParents);
  assertLeaf(leaf, path);
  if (!hasKey(leaf.container, leaf.key))
    leaf.container[leaf.key] = value;
};

const remove = function(obj, path) {
  const leaf = getLeaf(obj, path, false);
  assertLeaf(leaf, path);
  delete leaf.container[leaf.key];
};

const replace = function(obj, path, value) {
  const leaf = getLeaf(obj, path, false);
  assertLeaf(leaf, path);
  if (hasKey(leaf.container, leaf.key))
    leaf.container[leaf.key] = value;
};

const upsert = function(obj, path, value, createParents) {
  const leaf = getLeaf(obj, path, createParents);
  assertLeaf(leaf, path);
  leaf.container[leaf.key] = value;
};

const state = new WeakMap();
const me = (self) => { return state.get(self); };

class DocumentFragment {
  constructor(contents, paths) {
    state.set(this, {
      contents: contents,
      paths: paths
    });
  }

  content(path) {
    assertPath(path);
    const leaf = getLeaf(obj, path, false);
    return (typeof leaf === 'undefined')
      ? undefined
      : leaf.container[leaf.key];
  }

  contentByIndex(index) {
    assertIndex(index);
    const paths = me(this).paths;
    if (index >= paths.length) return undefined;
    return this.content(paths[index]);
  }

  exists(path) {
    assertPath(path);
    return (typeof getLeaf(obj, path, false) !== 'undefined');
  }
}

class LookupInBuilder {
  constructor(bucket, key) {
    assertBucket(bucket);
    assertKey(key);
    state.set(this, {
      bucket: bucket,
      key: key,
      ops: []
    });
  }

  get operations() { return me(this).ops.slice(0); }

  execute(callback) {
    assertCallback(callback);
    const state = me(this);
    const cb = callback;
    state.bucket.get(state.key, (err, res) => {
      if (err) callback(err, null);
      else {
        const paths = [];
        for (let i = 0; i < state.ops.length; i++) {
          paths.push(state.ops[i].path);
        }
        const result = new DocumentFragment(res.value, paths);
        callback(null, result);
      }
    });
  }

  exists(path) {
    assertPath(path);
    me(this).ops.push({
      name: 'exists',
      path: path
    });
    return this;
  }

  get(path) {
    assertPath(path);
    me(this).ops.push({
      name: 'get',
      path: path
    });
    return this;
  }
}

class MutateInBuilder {
  constructor(bucket, key) {
    assertBucket(bucket);
    assertKey(key);
    state.set(this, {
      bucket: bucket,
      key: key,
      ops: []
    })
  }

  get operations() { return me(this).ops.slice(0); }

  arrayAddUnique(path, value, createParents) {
    assertPath(path);
    assertCreateParents(createParents);
    me(this).ops.push({
      name: 'arrayAddUnique',
      path: path,
      value: value,
      createParents: createParents
    });
    return this;
  }

  arrayAppend(path, value, createParents) {
    assertPath(path);
    assertCreateParents(createParents);
    me(this).ops.push({
      name: 'arrayAppend',
      path: path,
      value: value,
      createParents: createParents
    });
    return this;
  }

  arrayInsert(path, value) {
    assertPath(path);
    me(this).ops.push({
      name: 'arrayInsert',
      path: path,
      value: value
    });
    return this;
  }

  arrayPrepend(path, value, createParents) {
    assertPath(path);
    assertCreateParents(createParents);
    me(this).ops.push({
      name: 'arrayPrepend',
      path: path,
      value: value,
      createParents: createParents
    });
    return this;
  }

  counter(path, delta, createParents) {
    assertPath(path);
    assertDelta(delta);
    assertCreateParents(createParents);
    me(this).ops.push({
      name: 'counter',
      path: path,
      delta: delta,
      createParents: createParents
    });
    return this;
  }

  execute(callback) {
    assertCallback(callback);

    const cb = callback;
    const state = me(this);

    state.bucket.get(state.key, (error, result) => {
      if (isFailure(error)) {
        cb(error, null);
        return;
      }

      const obj = result.value;
      const ops = state.ops;

      for (let i = 0; i < ops.length; i++) {
        const op = ops[i];

        switch(op.name) {
          case 'arrayAddUnique':
            arrayAddUnique(obj, op.path, op.value, op.createParents);
            break;
          case 'arrayAppend':
            arrayAppend(obj, op.path, op.value, op.createParents);
            break;
          case 'arrayInsert':
            arrayInsert(obj, op.path, op.value);
            break;
          case `arrayPrepend`:
            arrayPrepend(obj, op.path, op.value, op.createParents);
          case 'counter':
            counter(obj, op.path, op.delta, op.createParents);
            break;
          case 'insert':
            insert(obj, op.path, op.value, op.createParents);
            break;
          case 'remove':
            remove(obj, op.path);
            break;
          case 'replace':
            replace(obj, op.path, op.value);
            break;
          case 'upsert':
            upsert(obj, op.path, op.value, op.createParents);
            break;
          default:
            throw new Error(`Unsupported operation encountered: {op.name}`);
        }
      }

      state.bucket.replace(state.key, obj, (err, res) => {
        cb(err, res);
      });
    });
  }

  insert(path, value, createParents) {
    assertPath(path);
    assertCreateParents(createParents);
    me(this).ops.push({
      name: 'insert',
      path: path,
      value: value,
      createParents: createParents
    });
    return this;
  }

  remove(path) {
    assertPath(path);
    me(this).ops.push({
      name: 'remove',
      path: path
    });
    return this;
  }

  replace(path, value) {
    assertPath(path);
    me(this).ops.push({
      name: 'replace',
      path: path,
      value: value
    });
    return this;
  }

  upsert(path, value, createParents) {
    assertPath(path);
    assertCreateParents(createParents);
    me(this).ops.push({
      name: 'upsert',
      path: path,
      value: value,
      createParents: createParents
    });
    return this;
  }
}

module.exports = {
  LookupInBuilder: LookupInBuilder,
  MutateInBuilder: MutateInBuilder
}
