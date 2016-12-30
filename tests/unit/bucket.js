'use strict';

const assert = require('chai').assert;

const couchbase = require('../../lib/couchbase');
const Bucket = require('../../lib/bucket');
const BucketManager = require('../../lib/bucketmgr.js');
const LookupInBuilder = require('../../lib/lookup-in');
const MutateInBuilder = require('../../lib/mutate-in');
const ViewQuery = require('../../lib/couchbase').ViewQuery;

test(require('bluebird'), 'bluebird');
test(Promise, 'native');
test(require('kew'), 'kew');
test(require('Q'), 'Q');
test(require('rsvp'), 'Rsvp');

function test(library, libraryName) {
  describe(`${libraryName} - Bucket`, () => {
    couchbase.setPromiseLib(library);

    after(() => {
      couchbase.revertPromiseLib();
    });

    let cluster, bucket;

    const docKey = 'testDocKey';
    const testDoc = { a: 1, b: 'x', c: [] };
    const strKey = 'testStringKey';
    const testStr = 'x';
    const numKey = 'testNumberKey';
    const testNum = 1;
    const testDDoc = 'testDDoc';
    const listKey = 'listKey';
    const listValue = 'a';
    const mapKey = 'mapKey';
    const mapPath = 'a';
    const mapValue = 'a';
    const qKey = 'qKey';
    const qValue = 'a';
    const setKey = 'setKey';
    const setValue = 'a';

    beforeEach((done) => {
      cluster = new couchbase.Mock.Cluster();
      bucket = cluster.openBucket();

      const insertDD = (callback) => {
        const mgr = bucket.manager();
        const ddoc = {
          views: {
            test: {
              map: 'function(doc, meta) { emit(doc, null); }'
            }
          }
        };
        mgr.insertDesignDocument(testDDoc, ddoc, (derr, dres) => {
          if (derr) throw derr;
          mgr.getDesignDocument(testDDoc, (de, dr) => {
            callback();
          });
        });
      };

      const insertSet = (callback) => {
        bucket.setAdd(setKey, setValue, { createSet: true }, () => {
          insertDD(() => {
            callback();
          })
        });
      };

      const insertQueue = (callback) => {
        bucket.queuePush(qKey, qValue, { createQueue: true }, () => {
          insertSet(() => {
            callback();
          });
        });
      };

      const insertMap = (callback) => {
        bucket.mapAdd(mapKey, mapPath, mapValue, { createMap: true }, () => {
          insertQueue(() => {
            callback();
          });
        });
      };

      const insertList = (callback) => {
        bucket.listAppend(listKey, listValue, { createList: true }, () => {
          insertMap(() => {
            callback();
          });
        });
      };

      const insertNum = (callback) => {
        bucket.insert(numKey, testNum, () => {
          insertList(() => {
            callback();
          });
        });
      };

      const insertStr = (callback) => {
        bucket.insert(strKey, testStr, () => {
          insertNum(() => {
            callback();
          });
        });
      };

      const insertDoc = (callback) => {
        bucket.insert(docKey, testDoc, () => {
          insertStr(() => {
            callback();
          });
        });
      };

      insertDoc(() => {
        done();
      });
    });

    describe('#constructor', () => {
      it('should throw if no native bucket is provided', (done) => {
        assert.throws(() => {
          const result = new Bucket();
        }, TypeError);
        done();
      });

      it('should not throw if bucket is provided', (done) => {
        assert.doesNotThrow(() => {
          const result = new Bucket({});
        });
        done();
      });
    });

    describe('properties', () => {
      describe('#clientVersion', () => {
        it('should get the correct client version', (done) => {
          assert.strictEqual(bucket.clientVersion, '2.0.0');
          done();
        });

        it('should be read-only', (done) => {
          assert.throws(() => {
            bucket.clientVersion = "test";
          });
          done();
        });
      });

      describe('#configThrottle', () => {
        it('should get a number', (done) => {
          assert.isNumber(bucket.configThrottle);
          done();
        });

        it('should be settable', (done) => {
          bucket.configThrottle = 123;
          assert.strictEqual(bucket.configThrottle, 123);
          done();
        });
      });

      describe('#connectionTimeout', () => {
        it('should get a number', (done) => {
          assert.isNumber(bucket.connectionTimeout);
          done();
        });

        it('should be settable', (done) => {
          bucket.connectionTimeout = 123;
          assert.strictEqual(bucket.connectionTimeout, 123);
          done();
        });
      });

      describe('#durabilityInterval', () => {
        it('should get a number', (done) => {
          assert.isNumber(bucket.durabilityInterval);
          done();
        });

        it('should be settable', (done) => {
          bucket.durabilityInterval = 123;
          assert.strictEqual(bucket.durabilityInterval, 123);
          done();
        });
      });

      describe('#durabilityTimeout', () => {
        it('should get a number', (done) => {
          assert.isNumber(bucket.durabilityTimeout);
          done();
        });

        it('should be settable', (done) => {
          bucket.durabilityTimeout = 123;
          assert.strictEqual(bucket.durabilityTimeout, 123);
          done();
        });
      });

      describe('#lcbVersion', () => {
        it('should get a string', (done) => {
          assert.isString(bucket.lcbVersion);
          done();
        });

        it('should be read-only', (done) => {
          assert.throws(() => {
            bucket.lcbVersion = "test";
          });
          done();
        });
      });

      describe('#managementTimeout', () => {
        it('should get a number', (done) => {
          assert.isNumber(bucket.managementTimeout);
          done();
        });

        it('should be settable', (done) => {
          bucket.managementTimeout = 123;
          assert.strictEqual(bucket.managementTimeout, 123);
          done();
        });
      });

      describe('#n1qlTimeout', () => {
        it('should get a number', (done) => {
          assert.isNumber(bucket.n1qlTimeout);
          done();
        });

        it('should be settable', (done) => {
          bucket.n1qlTimeout = 123;
          assert.strictEqual(bucket.n1qlTimeout, 123);
          done();
        });
      });

      describe('#nodeConnectionTimeout', () => {
        it('should get a number', (done) => {
          assert.isNumber(bucket.nodeConnectionTimeout);
          done();
        });

        it('should be settable', (done) => {
          bucket.nodeConnectionTimeout = 123;
          assert.strictEqual(bucket.nodeConnectionTimeout, 123);
          done();
        });
      });

      describe('#operationTimeout', () => {
        it('should get a number', (done) => {
          assert.isNumber(bucket.operationTimeout);
          done();
        });

        it('should be settable', (done) => {
          bucket.operationTimeout = 123;
          assert.strictEqual(bucket.operationTimeout, 123);
          done();
        });
      });

      describe('#viewTimeout', () => {
        it('should get a number', (done) => {
          assert.isNumber(bucket.viewTimeout);
          done();
        });

        it('should be settable', (done) => {
          bucket.viewTimeout = 123;
          assert.strictEqual(bucket.viewTimeout, 123);
          done();
        });
      });
    });

    describe('methods', () => {
      describe('#addListener', () => {
        it('should return self', (done) => {
          const res = bucket.addListener('connect', () => {});
          assert.strictEqual(res, bucket);
          done();
        });

        it('should add listener', (done) => {
          const listener = () => {}
          bucket.addListener('connect', listener);
          const listeners = bucket.listeners('connect');
          assert.include(listeners, listener);
          done();
        });
      });

      describe('#append', () => {
        it('should append value', (done) => {
          bucket.append(strKey, 'y', (err, res) => {
            assert.isNotOk(err);
            bucket.get(strKey, (e, r) => {
              assert.isNotOk(err);
              assert.strictEqual(r.value, testStr + 'y');
              done();
            })
          });
        });
      });

      describe('#appendAsync()', () => {
        it('should return Promise', (done) => {
          const result = bucket.appendAsync(strKey, 'y');
          assert.instanceOf(result, couchbase.Promise);
          done();
        });

        it('should append value', (done) => {
          bucket.appendAsync(strKey, 'y')
            .then((res) => {
              return bucket.getAsync(strKey);
            })
            .then((res) => {
              assert.strictEqual(res.value, testStr + 'y');
              done();
            });
        });
      });

      describe('#appendMultiAsync', () => {
        it('should return Promise', (done) => {
          const stuff = new Map();
          stuff.set(strKey, { fragment: 'y' });
          const result = bucket.appendMultiAsync(stuff);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#counter', () => {
        it('should increment the key value by delta', (done) => {
          bucket.counter(numKey, 1, { initial: 0 }, (err, result) => {
            assert.isNotOk(err);
            bucket.get(numKey, (e, r) => {
              assert.isNotOk(err);
              assert.strictEqual(r.value, testNum + 1);
              done();
            });
          });
        });
      });

      describe('#counterAsync', () => {
        it('should return Promise', (done) => {
          const result = bucket.counterAsync(numKey, 1, { initial: 0 });
          assert.instanceOf(result, couchbase.Promise);
          done();
        });

        it('should increment the key value by delta', (done) => {
          bucket.counterAsync(numKey, 1)
            .then((res) => {
              return bucket.getAsync(numKey);
            })
            .then((res) => {
              assert.strictEqual(res.value, testNum + 1);
              done();
            });
        });
      });

      describe('#counterMultiAsync', () => {
        it('should return Promise', (done) => {
          const stuff = new Map();
          stuff.set(numKey, { delta: 1 });
          const result = bucket.counterMultiAsync(stuff);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#disconnect', () => {
        it('should not error', (done) => {
          assert.doesNotThrow(() => {
            bucket.disconnect();
            done();
          });
        });
      });

      describe('#emit', () => {
        it('should return self', (done) => {
          const result = bucket.emit('connect', 42);
          assert.strictEqual(result, bucket);
          done();
        });
      });

      describe('#eventNames', () => {
        it('should return an array', (done) => {
          const result = bucket.eventNames();
          assert.isArray(result);
          done();
        });
      });

      describe('#get', () => {
        it('should get a document', (done) => {
          bucket.get(strKey, (err, res) => {
            assert.isNotOk(err);
            assert.strictEqual(res.value, testStr);
            done();
          });
        });
      });

      describe('#getAsync', () => {
        it('should return Promise', (done) => {
          const result = bucket.getAsync(strKey);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });

        it('should get a document', (done) => {
          bucket.getAsync(strKey)
            .then((res) => {
              assert.strictEqual(res.value, testStr);
              done();
            });
        });
      });

      describe('#getAndLock', () => {
        it('should get a document', (done) => {
          bucket.getAndLock(strKey, (err, res) => {
            assert.isNotOk(err);
            assert.strictEqual(res.value, testStr);
            done();
          });
        });
      });

      describe('#getAndLockAsync', () => {
        it('should return Promise', (done) => {
          const result = bucket.getAndLockAsync(strKey);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });

        it('should get a document', (done) => {
          bucket.getAndLockAsync(strKey)
            .then((res) => {
              assert.strictEqual(res.value, testStr);
              done();
            });
        });
      });

      describe('#getAndLockMultiAsync', () => {
        it('should return Promise', (done) => {
          const result = bucket.getAndLockMultiAsync([strKey, numKey]);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#getAndTouch', () => {
        it('should get a document', (done) => {
          bucket.getAndTouch(strKey, 1000, (err, res) => {
            assert.isNotOk(err);
            assert.strictEqual(res.value, testStr);
            done();
          });
        });
      });

      describe('#getAndTouchAsync', () => {
        it('should return Promise', (done) => {
          const result = bucket.getAndTouchAsync(strKey, 1000);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });

        it('should get a document', (done) => {
          bucket.getAndTouchAsync(strKey, 1000)
            .then((res) => {
              assert.strictEqual(res.value, testStr);
              done();
            });
        });
      });

      describe('#getAndTouchMultiAsync', () => {
        it('should return Promise', (done) => {
          const stuff = new Map();
          stuff.set(strKey, { expiry: 300 });
          stuff.set(numKey, { expiry: 600 })
          const result = bucket.getAndTouchMultiAsync(stuff);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#getMaxListeners', () => {
        it('should return number', (done) => {
          const result = bucket.getMaxListeners();
          assert.isNumber(result);
          done();
        });
      });

      describe('#getMulti', () => {
        it('should get multiple documents', (done) => {
          bucket.getMulti([strKey, numKey], (err, res) => {
            assert.isNotOk(err);
            assert.property(res, strKey);
            assert.property(res, numKey);
            assert.strictEqual(res[strKey].value, testStr);
            assert.strictEqual(res[numKey].value, testNum);
            done();
          });
        });
      });

      describe('#getMultiAsync', () => {
        it('should return Promise', (done) => {
          const result = bucket.getMultiAsync([strKey, numKey]);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });

        it('should get multiple documents', (done) => {
          bucket.getMultiAsync([strKey, numKey])
            .then((res) => {
              assert.property(res, strKey);
              assert.property(res, numKey);
              assert.strictEqual(res[strKey].value, testStr);
              assert.strictEqual(res[numKey].value, testNum);
              done();
            });
        });
      });

      describe('#getReplica', () => {
        it('should get a document', (done) => {
          bucket.getReplica(strKey, (err, res) => {
            assert.isNotOk(err);
            assert.strictEqual(testStr, res.value);
            done();
          });
        });
      });

      describe('#getReplicaAsync', () => {
        it('should return Promise', (done) => {
          const result = bucket.getReplicaAsync(strKey);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });

        it('should get a document', (done) => {
          bucket.getReplicaAsync(strKey)
            .then((res) => {
              assert.strictEqual(res.value, testStr);
              done();
            });
        });
      });

      describe('#getReplicaMultiAsync', () => {
        it('should return Promise', (done) => {
          const result = bucket.getReplicaMultiAsync([strKey, numKey]);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#insert', () => {
        const key = 'insertTest';
        const value = 42;

        it('should insert a document', (done) => {
          bucket.insert(key, value, (err, res) => {
            assert.isNotOk(err);
            bucket.get(key, (e, r) => {
              assert.isNotOk(e);
              assert.strictEqual(r.value, value);
              done();
            });
          });
        });
      });

      describe('#insertAsync', () => {
        const key = 'insertTest';
        const value = 42;

        it('should return Promise', (done) => {
          const result = bucket.insertAsync(key, value);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });

        it('should insert a document', (done) => {
          bucket.insertAsync(key, value)
            .then((res) => {
              return bucket.getAsync(key);
            })
            .then((res) => {
              assert.strictEqual(res.value, value);
              done();
            });
        });
      });

      describe('#insertMultiAsync', () => {
        const docs = {
          a: { value: 42 },
          b: { value: 24 }
        };

        const invalidDocs = {
          a: { value: 42 },
          b: { value: 24 }
        };

        invalidDocs[strKey] = { value: testStr };

        it('should return Promise', (done) => {
          const result = bucket.insertMultiAsync(docs);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });

        it('should throw if docs not an object', (done) => {
          assert.throws(() => {
            bucket.insertMultiAsync(42);
          }, TypeError);
          done();
        });

        it('should throw if docs is an array', (done) => {
          assert.throws(() => {
            bucket.insertMultiAsync([42]);
          }, TypeError);
          done();
        });

        it('should throw if docs is null', (done) => {
          assert.throws(() => {
            bucket.insertMultiAsync(null);
          }, TypeError);
          done();
        });

        it('should return summary with array of keys', (done) => {
          bucket.insertMultiAsync(invalidDocs)
            .then((res) => {
              assert.isArray(res.keys);
              done();
            });
        });

        it('should return summary with key for all docs', (done) => {
          bucket.insertMultiAsync(invalidDocs)
            .then((res) => {
              assert.include(res.keys, 'a');
              assert.include(res.keys, 'b');
              assert.include(res.keys, strKey);
              done();
            });
        });

        it('should return summary with hasErrors Boolean flag', (done) => {
          bucket.insertMultiAsync(invalidDocs)
            .then((res) => {
              assert.isBoolean(res.hasErrors);
              done();
            });
        });

        it('should return summary with hasErrors=true when error', (done) => {
          bucket.insertMultiAsync(invalidDocs)
            .then((res) => {
              assert.isTrue(res.hasErrors);
              done();
            });
        });

        it('should return summary hasErrors=false when no error', (done) => {
          bucket.insertMultiAsync(docs)
            .then((res) => {
              assert.isFalse(res.hasErrors);
              done();
            });
        });

        it('should return summary with object of results', (done) => {
          bucket.insertMultiAsync(invalidDocs)
            .then((res) => {
              assert.isObject(res.results);
              done();
            });
        });

        it('should return summary with result for all docs', (done) => {
          bucket.insertMultiAsync(invalidDocs)
            .then((res) => {
              assert.deepProperty(res, 'results.a');
              assert.deepProperty(res, 'results.b');
              assert.deepProperty(res, 'results.' + strKey);
              done();
            });
        });

        it('should insert key-values from Map', (done) => {
          const docsMap = new Map();
          docsMap.set('a', { value: 42 });
          docsMap.set('b', { value: 24 });

          bucket.insertMultiAsync(docsMap)
            .then((res) => {
              assert.isOk(res);
              return bucket.getMultiAsync(['a', 'b'])
            })
            .then((res) => {
              assert.property(res, 'a');
              assert.property(res, 'b');
              assert.strictEqual(res.a.value, docsMap.get('a').value);
              assert.strictEqual(res.b.value, docsMap.get('b').value);
              done();
            });
        });

        it('should insert key-values from object', (done) => {
          bucket.insertMultiAsync(docs)
            .then((res) => {
              assert.isOk(res);
              return bucket.getMultiAsync(['a', 'b'])
            })
            .then((res) => {
              assert.property(res, 'a');
              assert.property(res, 'b');
              assert.strictEqual(res.a.value, docs.a.value);
              assert.strictEqual(res.b.value, docs.b.value);
              done();
            });
        });

        it('should insert valid docs when there are invalid docs', (done) => {
          bucket.insertMultiAsync(invalidDocs)
            .then((res) => {
              assert.isTrue(res.results.a.success);
              assert.isTrue(res.results.b.success);
              return bucket.getMultiAsync(['a', 'b']);
            })
            .then((res) => {
              assert.property(res, 'a');
              assert.property(res, 'b');
              assert.strictEqual(res.a.value, invalidDocs.a.value);
              assert.strictEqual(res.b.value, invalidDocs.b.value);
              done();
            });
        });

        it('should responed as errored for invalid docs', (done) => {
          bucket.insertMultiAsync(invalidDocs)
            .then((res) => {
              assert.isTrue(res.hasErrors);
              assert.isFalse(res.results[strKey].success);
              done();
            });
        });
      });

      describe('#listAppend', () => {
        it('should append to list', (done) => {
          const value = 'b';
          bucket.listAppend(listKey, value, (err, res) => {
            assert.isNotOk(err);
            bucket.listGet(listKey, 1, (e, res) => {
              assert.isNotOk(e);
              assert.strictEqual(res.value, value);
              done();
            });
          });
        });
      });

      describe('#listAppendAsync', () => {
        it('should append to list', (done) => {
          const value = 'b';
          bucket.listAppendAsync(listKey, value)
            .then((res) => {
              return bucket.listGetAsync(listKey, 1);
            })
            .then((res) => {
              assert.strictEqual(res.value, value);
              done();
            })
            .catch((err) => {
              assert.fail(err);
              done();
            });
        });

        it('should return Promise', (done) => {
          const result = bucket.listAppendAsync(listKey, 'b');
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#listAppendMultiAsync', () => {
        it('should return Promise', (done) => {
          const value = 'b'
          const keys = new Map();
          keys.set(listKey, { value: value });
          const result = bucket.listAppendMultiAsync(keys);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#listGet', () => {
        it('should get item from list', (done) => {
          bucket.listGet(listKey, 0, (err, res) => {
            assert.isNotOk(err);
            assert.strictEqual(res.value, listValue);
            done();
          });
        });
      });

      describe('#listGetAsync', () => {
        it('should get item from list', (done) => {
          bucket.listGetAsync(listKey, 0)
            .then((res) => {
              assert.strictEqual(res.value, listValue);
              done();
            })
            .catch((err) => {
              assert.isNotOk(err);
              done();
            });
        });

        it('should return Promise', (done) => {
          const result = bucket.listGetAsync(listKey, 0);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#listGetMultiAsync', () => {
        it('should return Promise', (done) => {
          const keys = new Map();
          keys.set(listKey, { index: 0 });
          const result = bucket.listGetMultiAsync(keys);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#listenerCount', () => {
        it('should return number', (done) => {
          const result = bucket.listenerCount();
          assert.isNumber(result);
          done();
        });
      });

      describe('#listeners', () => {
        it('should return an array', (done) => {
          const result = bucket.listeners('connect');
          assert.isArray(result);
          done();
        });
      });

      describe('#listPrepend', () => {
        it('should prepend value', (done) => {
          const value = 'b';
          bucket.listPrepend(listKey, value, (err, res) => {
            assert.isNotOk(err);
            bucket.listGet(listKey, 0, (e, res) => {
              assert.isNotOk(e);
              assert.strictEqual(res.value, value);
              done();
            });
          });
        });
      });

      describe('#listPrependAsync', () => {
        it('should prepend value', (done) => {
          const value = 'b';
          bucket.listPrependAsync(listKey, value)
            .then((res) => {
              return bucket.listGetAsync(listKey, 0);
            })
            .then((res) => {
              assert.strictEqual(res.value, value);
              done();
            })
            .catch((err) => {
              assert.fail(err);
              done();
            });
        });

        it('should return Promise', (done) => {
          const result = bucket.listPrependAsync(listKey, 'b');
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#listPrependMultiAsync', () => {
        it('should return Promise', (done) => {
          const value = 'b'
          const keys = new Map();
          keys.set(listKey, { value: value });
          const result = bucket.listPrependMultiAsync(keys);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#listRemove', () => {
        it('should remove from list', (done) => {
          bucket.listRemove(listKey, 0, (err, res) => {
            assert.isNotOk(err);
            bucket.listSize(listKey, (e, r) => {
              assert.strictEqual(r.value, 0);
              done();
            });
          });
        });
      });

      describe('#listRemoveAsync', () => {
        it('should remove from list', (done) => {
          bucket.listRemoveAsync(listKey, 0)
            .then((res) => {
              return bucket.listSizeAsync(listKey);
            })
            .then((res) => {
              assert.strictEqual(res.value, 0);
              done();
            })
            .catch((err) => {
              assert.fail(err);
              done();
            });
        });

        it('should return Promise', (done) => {
          const result = bucket.listRemoveAsync(listKey, 0);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#listRemoveMultiAsync', () => {
        it('should return Promise', (done) => {
          const keys = new Map();
          keys.set(listKey, { index: 0 });
          const result = bucket.listRemoveMultiAsync(keys);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#listSet', () => {
        it('should set value in list', (done) => {
          const value = 'b'
          bucket.listSet(listKey, 0, value, (err, res) => {
            assert.isNotOk(err);
            bucket.listGet(listKey, 0, (e, r) => {
              assert.strictEqual(r.value, value);
              done();
            });
          });
        });
      });

      describe('#listSetAsync', () => {
        it('should set value in list', (done) => {
          const value = 'b';
          bucket.listSetAsync(listKey, 0, value)
            .then((res) => {
              return bucket.listGetAsync(listKey, 0);
            })
            .then((res) => {
              assert.strictEqual(res.value, value);
              done();
            })
            .catch((err) => {
              assert.fail(err);
              done();
            });
        });

        it('should return Promise', (done) => {
          const result = bucket.listSetAsync(listKey, 0, 'b');
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#listSetMultiAsync', () => {
        it('should return Promise', (done) => {
          const keys = new Map();
          keys.set(listKey, { index: 0, value: 'b' });
          const result = bucket.listSetMultiAsync(keys);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#listSize', () => {
        it('should get size of list', (done) => {
          bucket.listSize(listKey, (err, res) => {
            assert.isNotOk(err);
            assert.strictEqual(res.value, 1);
            done();
          });
        });
      });

      describe('#listSizeAsync', () => {
        it('should get size of list', (done) => {
          bucket.listSizeAsync(listKey)
            .then((res) => {
              assert.strictEqual(res.value, 1);
              done();
            })
            .catch((err) => {
              assert.fail(err);
              done();
            });
        });

        it('should return Promise', (done) => {
          const result = bucket.listSizeAsync(listKey);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#listSizeMultiAsync', () => {
        it('should return Promise', (done) => {
          const result = bucket.listSizeMultiAsync([ listKey ]);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#lookupIn', () => {
        it('should return instance of LookupInBuilder', (done) => {
          const look = bucket.lookupIn(docKey);
          assert.instanceOf(look, LookupInBuilder);
          done();
        });
      });

      describe('#manager', () => {
        it('should return instance of BucketManager', (done) => {
          const man = bucket.manager();
          assert.instanceOf(man, BucketManager);
          done();
        });
      });

      describe('#mapAdd', () => {
        it('should add to map', (done) => {
          const path = 'b';
          const value = 'b';
          bucket.mapAdd(mapKey, path, value, (err, res) => {
            assert.isNotOk(err);
            bucket.mapGet(mapKey, path, (e, r) => {
              assert.isNotOk(e);
              assert.strictEqual(r.value, value);
              done();
            });
          });
        });
      });

      describe('#mapAddAsync', () => {
        it('should add to map', (done) => {
          const path = 'b';
          const value = 'b';
          bucket.mapAddAsync(mapKey, path, value)
            .then((res) => {
              return bucket.mapGetAsync(mapKey, path);
            })
            .then((res) => {
              assert.strictEqual(res.value, value);
              done();
            })
            .catch((err) => {
              assert.fail(err);
              done();
            });
        });

        it('should return Promise', (done) => {
          const result = bucket.mapAddAsync(mapKey, 'b', 'b');
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#mapAddMultiAsync', () => {
        it('should return Promise', (done) => {
          const docs = new Map();
          docs.set(mapKey, { path: 'b', value: 'b' });
          const result = bucket.mapAddMultiAsync(docs);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#mapGet', () => {
        it('should get map value', (done) => {
          bucket.mapGet(mapKey, mapPath, (err, res) => {
            assert.isNotOk(err);
            assert.strictEqual(res.value, mapValue);
            done();
          });
        });
      });

      describe('#mapGetAsync', () => {
        it('should get map value', (done) => {
          bucket.mapGetAsync(mapKey, mapPath)
            .then((res) => {
              assert.strictEqual(res.value, mapValue);
              done();
            })
            .catch((err) => {
              assert.fail(err);
              done();
            });
        });

        it('should return Promise', (done) => {
          const result = bucket.mapGetAsync(mapKey, mapPath);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#mapGetMultiAsync', () => {
        it('should return Promise', (done) => {
          const docs = new Map();
          docs.set(mapKey, { path: mapPath });
          const result = bucket.mapAddMultiAsync(docs);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#mapRemove', () => {
        it('should remove value from map', (done) => {
          bucket.mapRemove(mapKey, mapPath, (err, res) => {
            assert.isNotOk(err);
            bucket.mapSize(mapKey, (e, r) => {
              assert.isNotOk(e);
              assert.strictEqual(r.value, 0);
              done();
            });
          });
        });
      });

      describe('#mapRemoveAsync', () => {
        it('should remove value from map', (done) => {
          bucket.mapRemoveAsync(mapKey, mapPath)
            .then((res) => {
              return bucket.mapSizeAsync(mapKey);
            })
            .then((res) => {
              assert.strictEqual(res.value, 0);
              done();
            })
            .catch((err) => {
              assert.fail(err);
              done();
            });
        });

        it('should return Promise', (done) => {
          const result = bucket.mapRemoveAsync(mapKey, mapPath);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#mapRemoveMultiAsync', () => {
        it('should return Promise', (done) => {
          const docs = new Map();
          docs.set(mapKey, { path: mapPath });
          const result = bucket.mapRemoveMultiAsync(docs);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#mapSize', () => {
        it('should return size of map', (done) => {
          bucket.mapSize(mapKey, (err, res) => {
            assert.isNotOk(err);
            assert.strictEqual(res.value, 1);
            done();
          });
        });
      });

      describe('#mapSizeAsync', () => {
        it('should return size of map', (done) => {
          bucket.mapSizeAsync(mapKey)
            .then((res) => {
              assert.strictEqual(res.value, 1);
              done();
            })
            .catch((err) => {
              assert.fail(err);
              done();
            });
        });

        it('should return Promise', (done) => {
          const result = bucket.mapSizeAsync(mapKey);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#mapSizeMultiAsync', () => {
        it('should return Promise', (done) => {
          const result = bucket.mapSizeMultiAsync([ mapKey ]);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#mutateIn', () => {
        it('should return an instance of MutateInBuilder', (done) => {
          const mut = bucket.mutateIn(docKey);
          assert.instanceOf(mut, MutateInBuilder);
          done();
        });
      });

      describe('#on', () => {
        it('should return self', (done) => {
          const result = bucket.on('connect', () => {});
          assert.strictEqual(result, bucket);
          done();
        });
      });

      describe('#once', () => {
        it('should return self', (done) => {
          const result = bucket.once('connect', () => {});
          assert.strictEqual(result, bucket);
          done();
        });
      });

      describe('#prependListener', () => {
        it('should return self', (done) => {
          const result = bucket.prependListener('connect', () => {});
          assert.strictEqual(result, bucket);
          done();
        });
      });

      describe('#prependOnceListener', () => {
        it('should return self', (done) => {
          const result = bucket.prependOnceListener('connect', () => {});
          assert.strictEqual(result, bucket);
          done();
        });
      });

      describe('#prepend', () => {
        it('should prepend value', (done) => {
          bucket.prepend(strKey, 'y', (err, res) => {
            assert.isNotOk(err);
            bucket.get(strKey, (e, r) => {
              assert.isNotOk(err);
              assert.strictEqual(r.value, 'y' + testStr);
              done();
            })
          });
        });
      });

      describe('#prependAsync', () => {
        it('should return Promise', (done) => {
          const result = bucket.prependAsync(strKey, 'y');
          assert.instanceOf(result, couchbase.Promise);
          done();
        });

        it('should prepend value', (done) => {
          bucket.prependAsync(strKey, 'y')
            .then((res) => {
              return bucket.getAsync(strKey);
            })
            .then((res) => {
              assert.strictEqual(res.value, 'y' + testStr);
              done();
            });
        });
      });

      describe('#prependMultiAsync', () => {
        it('should return Promise', (done) => {
          const keys = new Map();
          keys.set(strKey, { fragment: 'b' });
          const result = bucket.prependMultiAsync(keys);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#query', () => {
        const query = ViewQuery.from(testDDoc, 'test');
        it('should execute a query', (done) => {
          bucket.query(query, (err, rows, meta) => {
            assert.isNotOk(err);
            assert.isOk(rows);
            assert.isOk(meta);
            done();
          });
        });
      });

      describe('#queryAsync', () => {
        const query = ViewQuery.from(testDDoc, 'test');

        it('should return Promise', (done) => {
          const result = bucket.queryAsync(query);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });

        it('should execute a query', (done) => {
          bucket.queryAsync(query)
            .then((result) => {
              assert.isOk(result);
              assert.isArray(result);
              assert.lengthOf(result, 2);
              done();
            });
        });
      });

      describe('#queuePop', () => {
        it('should pop next in line', (done) => {
          bucket.queuePop(qKey, (err, res) => {
            assert.isNotOk(err);
            assert.strictEqual(res.value, qValue);
            done();
          });
        });
      });

      describe('#queuePopAsync', () => {
        it('should pop next in line', (done) => {
          bucket.queuePopAsync(qKey)
            .then((res) => {
              assert.strictEqual(res.value, qValue);
              done();
            })
            .catch((err) => {
              assert.fail(err);
              done();
            });
        });
      });

      describe('#queuePopMultiAsync', () => {
        it('should return Promise', (done) => {
          const result = bucket.queuePopMultiAsync([ qKey ]);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#queuePush', () => {
        it('should add value to the end of the line', (done) => {
          bucket.queuePush(qKey, 'b', (err, res) => {
            assert.isNotOk(err);
            bucket.queueSize(qKey, (e, r) => {
              assert.strictEqual(r.value, 2);
              done();
            });
          });
        });
      });

      describe('#queuePushAsync', () => {
        it('should add value to the end of the line', (done) => {
          bucket.queuePushAsync(qKey, 'b')
            .then((res) => {
              return bucket.queueSizeAsync(qKey);
            })
            .then((res) => {
              assert.strictEqual(res.value, 2);
              done();
            })
            .catch((err) => {
              assert.fail(err);
              done();
            });
        });

        it('should return Promise', (done) => {
          const result = bucket.queuePushAsync(qKey, 'b');
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#queuePushMultiAsync', () => {
        it('should return Promise', (done) => {
          const keys = new Map();
          keys.set(qKey, { value: 'b' });
          const result = bucket.queuePushMultiAsync(keys);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#queueSize', () => {
        it('should return size of queue', (done) => {
          bucket.queueSize(qKey, (err, res) => {
            assert.isNotOk(err);
            assert.strictEqual(res.value, 1);
            done();
          });
        });
      });

      describe('#queueSizeAsync', () => {
        it('should return size of queue', (done) => {
          bucket.queueSizeAsync(qKey)
            .then((res) => {
              assert.strictEqual(res.value, 1);
              done();
            })
            .catch((err) => {
              assert.fail(err);
              done();
            });
        });

        it('should return Promise', (done) => {
          const result = bucket.queueSizeAsync(qKey);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#queueSizeMultiAsync', () => {
        it('should return Promise', (done) => {
          const result = bucket.queueSizeMultiAsync([ qKey ]);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#remove', () => {
        it('should remove a key', (done) => {
          bucket.remove(strKey, (err, res) => {
            assert.isNotOk(err);
            assert.isOk(res);
            done();
          });
        });
      });

      describe('#removeAsync', () => {
        it('should return Promise', (done) => {
          const result = bucket.removeAsync(strKey);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });

        it('should remove a key', (done) => {
          const result = bucket.removeAsync(strKey)
            .then((res) => {
              assert.isOk(res);
              done();
            });
        });
      });

      describe('#removeMultiAsync', () => {
        const keys = [strKey, numKey];
        const badKeys = [strKey, 42];
        const missingKey = 'nope'
        const missingKeys = [strKey, missingKey];

        it('should return Promise', (done) => {
          const result = bucket.removeMultiAsync(keys);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });

        it('should throw if keys is null', (done) => {
          assert.throws(() => {
            bucket.removeMultiAsync(null);
          }, TypeError);
          done();
        });

        it('should throw if keys is undefined', (done) => {
          assert.throws(() => {
            bucket.removeMultiAsync(undefined);
          }, TypeError);
          done();
        });

        it('should throw if keys is not an Array, Set, or Map', (done) => {
          assert.throws(() => {
            bucket.removeMultiAsync(42);
          }, TypeError);
          done();
        });

        it('should return summary with array of keys', (done) => {
          bucket.removeMultiAsync(missingKeys)
            .then((res) => {
              assert.isArray(res.keys);
              done();
            });
        });

        it('should return summary with key for all docs', (done) => {
          bucket.removeMultiAsync(missingKeys)
            .then((res) => {
              assert.include(res.keys, strKey);
              assert.include(res.keys, missingKey);
              done();
            });
        });

        it('should return summary with hasErrors Boolean flag', (done) => {
          bucket.removeMultiAsync(missingKeys)
            .then((res) => {
              assert.isBoolean(res.hasErrors);
              done();
            });
        });

        it('should return summary with hasErrors=false when no error', (done) => {
          bucket.removeMultiAsync(keys)
            .then((res) => {
              assert.isFalse(res.hasErrors);
              done();
            });
        });

        it('should return summary with object of results', (done) => {
          bucket.removeMultiAsync(missingKeys)
            .then((res) => {
              assert.isObject(res.results);
              done();
            });
        });

        it('should return summary with result for all docs', (done) => {
          bucket.removeMultiAsync(missingKeys)
            .then((res) => {
              assert.deepProperty(res, 'results.' + strKey);
              assert.deepProperty(res, 'results.' + missingKey);
              done();
            });
        });

        it('should remove keys for an Array', (done) => {
          bucket.removeMultiAsync(keys)
            .then((res) => {
              assert.isOk(res);
              return bucket.getMultiAsync(keys);
            })
            .catch((err) => {
              assert.strictEqual(err, keys.length);
              done();
            });
        });

        it('should remove keys for a Map', (done) => {
          const map = new Map();
          map.set(strKey, strKey);
          map.set(numKey, numKey);

          bucket.removeMultiAsync(map)
            .then((res) => {
              assert.isOk(res);
              return bucket.getMultiAsync(keys);
            })
            .catch((err) => {
              assert.strictEqual(err, keys.length);
              done();
            });
        });

        it('should remove keys for a Set', (done) => {
          const set = new Set();
          set.add(strKey);
          set.add(numKey);

          bucket.removeMultiAsync(set)
            .then((res) => {
              assert.isOk(res);
              return bucket.getMultiAsync(keys);
            })
            .catch((err) => {
              assert.strictEqual(err, keys.length);
              done();
            });
        });
      });

      describe('#removeAllListeners', () => {
        it('should return self', (done) => {
          const result = bucket.removeAllListeners('connect');
          assert.strictEqual(result, bucket);
          done();
        });
      });

      describe('#removeListener', () => {
        it('should return self', (done) => {
          const result = bucket.removeListener('connect', () => {});
          assert.strictEqual(result, bucket);
          done();
        });
      });

      describe('#replace', () => {
        it('should replace a key\'s value', (done) => {
          const newValue = testNum * 2;
          bucket.replace(numKey, newValue, (err, res) => {
            assert.isNotOk(err);
            assert.isOk(res);
            bucket.get(numKey, (e ,r) => {
              assert.strictEqual(r.value, newValue);
              done();
            });
          });
        });
      });

      describe('#replaceAsync', () => {
        const newValue = testNum * 2;

        it('should return Promise', (done) => {
          const result = bucket.replaceAsync(numKey, newValue);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });

        it('should replace a key\'s value', (done) => {
          bucket.replaceAsync(numKey, newValue)
            .then((res) => {
              assert.isOk(res);
              return bucket.getAsync(numKey);
            })
            .then((res) => {
              assert.strictEqual(res.value, newValue);
              done();
            });
        });
      });

      describe('#setAdd', () => {
        it('should add to set', (done) => {
          const value = 'b';
          bucket.setAdd(setKey, value, (err, res) => {
            assert.isNotOk(err);
            bucket.setExists(setKey, value, (e, r) => {
              assert.isNotOk(e);
              assert.isTrue(r.value);
              done();
            });
          });
        });
      });

      describe('#setAddAsync', () => {
        it('should ', (done) => {
          const value = 'b';
          bucket.setAddAsync(setKey, value)
            .then((res) => {
              return bucket.setExistsAsync(setKey, value);
            })
            .then((res) => {
              assert.isTrue(res.value);
              done();
            })
            .catch((err) => {
              assert.fail(err);
              done();
            });
        });

        it('should return Promise', (done) => {
          const result = bucket.setAddAsync(setKey, 'b');
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#setAddMultiAsync', () => {
        it('should return Promise', (done) => {
          const docs = new Map();
          docs.set(mapKey, { value: 'b' });
          const result = bucket.setAddMultiAsync(docs);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#setExists', () => {
        it('should return true when exists in set', (done) => {
          bucket.setExists(setKey, setValue, (err, res) => {
            assert.isNotOk(err);
            assert.isTrue(res.value);
            done();
          });
        });
      });

      describe('#setExistsAsync', () => {
        it('should return true when exists in set', (done) => {
          bucket.setExistsAsync(setKey, setValue)
            .then((res) => {
              assert.isTrue(res.value);
              done();
            })
            .catch((err) => {
              assert.fail(err);
              done();
            });
        });

        it('should return Promise', (done) => {
          const result = bucket.setExistsAsync(setKey, setValue);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#setExistsMultiAsync', () => {
        it('should return Promise', (done) => {
          const keys = new Map();
          keys.set(setKey, { value: setValue });
          const result = bucket.setExistsMultiAsync(keys);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#setMaxListeners', () => {
        it('should return self', (done) => {
          const result = bucket.setMaxListeners(100);
          assert.strictEqual(result, bucket);
          done();
        });
      });

      describe('#setRemove', () => {
        it('should remove from set', (done) => {
          bucket.setRemove(setKey, setValue, (err, res) => {
            assert.isNotOk(err);
            bucket.setExists(setKey, setValue, (err, res) => {
              assert.isNotOk(err);
              assert.isFalse(res.value);
              done();
            });
          });
        });
      });

      describe('#setRemoveAsync', () => {
        it('should remove from set', (done) => {
          bucket.setRemoveAsync(setKey, setValue)
            .then((res) => {
              return bucket.setExistsAsync(setKey, setValue);
            })
            .then((res) => {
              assert.isFalse(res.value);
              done();
            })
            .catch((err) => {
              assert.fail(err);
              done();
            });
        });

        it('should return Promise', (done) => {
          const result = bucket.setRemoveAsync(setKey, setValue);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#setRemoveMultiAsync', () => {
        it('should return Promise', (done) => {
          const keys = new Map();
          keys.set(setKey, { value: setValue });
          const result = bucket.setRemoveMultiAsync(keys);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#setSize', () => {
        it('should return size of set', (done) => {
          bucket.setSize(setKey, (err, res) => {
            assert.isNotOk(err);
            assert.strictEqual(res.value, 1);
            done();
          });
        });
      });

      describe('#setSizeAsync', () => {
        it('should return size of set', (done) => {
          bucket.setSizeAsync(setKey)
            .then((res) => {
              assert.strictEqual(res.value, 1);
              done();
            })
            .catch((err) => {
              assert.fail(err);
              done();
            });
        });

        it('should return Promise', (done) => {
          const result = bucket.setSizeAsync(setKey);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#setSizeMultiAsync', () => {
        it('should return Promise', (done) => {
          const result = bucket.setSizeMultiAsync([ setKey ]);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#touch', () => {
        it('should touch entry', (done) => {
          bucket.touch(numKey, 1000, (err, res) => {
            assert.isNotOk(err);
            assert.isOk(res);
            done();
          });
        });
      });

      describe('#touchAsync', () => {
        it('should return Promise', (done) => {
          const result = bucket.touchAsync(numKey, 1000);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });

        it('should touch entry', (done) => {
          bucket.touchAsync(numKey, 1000)
            .then((res) => {
              assert.isOk(res);
              done();
            });
        });
      });

      describe('#touchMultiAsync', () => {
        it('should return Promise', (done) => {
          const keys = new Map();
          keys.set(numKey, { expiry: 1000 });
          const result = bucket.touchMultiAsync(keys);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });

      describe('#unlock', () => {
        it('should unlock entry', (done) => {
          bucket.getAndLock(strKey, (err, res) => {
            assert.isNotOk(err);

            bucket.unlock(strKey, res.cas, (e, r) => {
              assert.isNotOk(err);
              assert.isOk(res);
              done();
            });
          });
        });
      });

      describe('#unlockAsync', () => {
        it('should return Promise', (done) => {
          bucket.getAndLockAsync(strKey)
            .then((res) => {
              const result = bucket.unlockAsync(strKey, res.cas);
              assert.instanceOf(result, couchbase.Promise);
              done();
            });
        });

        it('should unlock entry', (done) => {
          bucket.getAndLockAsync(strKey)
            .then((res) => {
              assert.isOk(res);
              return bucket.unlockAsync(strKey, res.cas);
            })
            .then((res) => {
              assert.isOk(res);
              done();
            });
        });
      });

      describe('#unlockMultiAsync', () => {
        it('should return Promise', (done) => {
          bucket.getAndLockAsync(strKey)
            .then((res) => {
              const keys = new Map();
              keys.set(strKey, { cas: res.cas });
              const result = bucket.unlockMultiAsync(keys);
              assert.instanceOf(result, couchbase.Promise);
              done();
            });
        });
      });

      describe('#upsert', () => {
        it('should upsert', (done) => {
          const newStr = testStr + '_TEST';
          bucket.upsert(strKey, newStr, (err, res) => {
            assert.isNotOk(err);
            assert.isOk(res);

            bucket.get(strKey, (e, r) => {
              assert.isNotOk(e);
              assert.strictEqual(r.value, newStr);
              done();
            });
          });
        });
      });

      describe('#upsertAsync', () => {
        const newStr = testStr + '_TEST';

        it('should return Promise', (done) => {
          const result = bucket.upsertAsync(strKey, newStr);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });

        it('should upsert', (done) => {
          bucket.upsertAsync(strKey, newStr)
            .then((res) => {
              assert.isOk(res);
              return bucket.getAsync(strKey);
            })
            .then((res) => {
              assert.isOk(res);
              assert.strictEqual(res.value, newStr);
              done();
            });
        });
      });

      describe('#upsertMultiAsync', () => {
        it('should return Promise', (done) => {
          const docs = new Map();
          docs.set('test', { value: 'test' });
          const result = bucket.upsertMultiAsync(docs);
          assert.instanceOf(result, couchbase.Promise);
          done();
        });
      });
    });
  });
}
