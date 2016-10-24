'use strict';

const assert = require('chai').assert;
const Promise = require('bluebird');

const couchbase = require('../../lib/couchbase');
const Bucket = require('../../lib/bucket');
const BucketManager = require('../../lib/bucketmgr.js');
const LookupInBuilder = require('../../lib/lookup-in');
const MutateInBuilder = require('../../lib/mutate-in');
const ViewQuery = require('../../lib/couchbase').ViewQuery;

describe('Bucket', () => {
  let cluster, bucket;

  const docKey = 'testDocKey';
  const testDoc = { a: 1, b: 'x', c: [] };
  const strKey = 'testStringKey';
  const testStr = 'x';
  const numKey = 'testNumberKey';
  const testNum = 1;
  const testDDoc = 'testDDoc';

  beforeEach((done) => {
    cluster = new couchbase.Mock.Cluster();
    bucket = cluster.openBucket();

    bucket.insert(docKey, testDoc, (error, result) => {
      bucket.insert(strKey, testStr, (err, res) => {
        bucket.insert(numKey, testNum, (e, res) => {
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
              done();
            });
          });
        });
      });
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
      it('should return a Promise', (done) => {
        const result = bucket.appendAsync(strKey, 'y');
        assert.instanceOf(result, Promise);
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
      it('should return a Promise', (done) => {
        const result = bucket.counterAsync(numKey, 1, { initial: 0 });
        assert.instanceOf(result, Promise);
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

    describe('#disconnect', () => {
      it('should not error', (done) => {
        assert.doesNotThrow(() => {
          bucket.disconnect();
          done();
        });
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
      it('should return a Promise', (done) => {
        const result = bucket.getAsync(strKey);
        assert.instanceOf(result, Promise);
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
      it('should return a Promise', (done) => {
        const result = bucket.getAndLockAsync(strKey);
        assert.instanceOf(result, Promise);
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

    describe('#getAndTouch', () => {
      it('should get a document', (done) => {
        bucket.getAndTouch(strKey, 1000, (err, res) => {
          assert.isNotOk(err);
          assert.strictEqual(res.value, testStr);
          done();
        });
      });
    });

    describe('#getAndTouchkAsync', () => {
      it('should return a Promise', (done) => {
        const result = bucket.getAndTouchAsync(strKey, 1000);
        assert.instanceOf(result, Promise);
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
      it('should return a Promise', (done) => {
        const result = bucket.getMultiAsync([strKey, numKey]);
        assert.instanceOf(result, Promise);
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
      it('should return a Promise', (done) => {
        const result = bucket.getReplicaAsync(strKey);
        assert.instanceOf(result, Promise);
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

      it('should return a Promise', (done) => {
        const result = bucket.insertAsync(key, value);
        assert.instanceOf(result, Promise);
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
        a: 42,
        b: 24
      };

      const invalidDocs = {
        a: 42,
        b: 24
      }
      invalidDocs[strKey] = testStr;

      it('should return a Promise', (done) => {
        const result = bucket.insertMultiAsync(docs);
        assert.instanceOf(result, Promise);
        done();
      });

      it('should throw if docs not an object', (done) => {
        assert.throws(() => {
          bucket.insertMultiAsync(42)
            .then((res) => {
              assert.fail();
            });
        }, TypeError);
        done();
      });

      it('should throw if docs is an array', (done) => {
        assert.throws(() => {
          bucket.insertMultiAsync([42])
            .then((res) => {
              assert.fail();
            });
        }, TypeError);
        done();
      });

      it('should throw if docs is null', (done) => {
        assert.throws(() => {
          bucket.insertMultiAsync(null)
            .then((res) => {
              assert.fail();
            });
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

      it('should return summary with hasErrors=false when no error', (done) => {
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
        docsMap.set('a', 42);
        docsMap.set('b', 24);

        bucket.insertMultiAsync(docsMap)
          .then((res) => {
            assert.isOk(res);
            return bucket.getMultiAsync(['a', 'b'])
          })
          .then((res) => {
            assert.property(res, 'a');
            assert.property(res, 'b');
            assert.strictEqual(res.a.value, docsMap.get('a'));
            assert.strictEqual(res.b.value, docsMap.get('b'));
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
            assert.strictEqual(res.a.value, docs.a);
            assert.strictEqual(res.b.value, docs.b);
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
            assert.strictEqual(res.a.value, invalidDocs.a);
            assert.strictEqual(res.b.value, invalidDocs.b);
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

    describe('#mutateIn', () => {
      it('should return an instance of MutateInBuilder', (done) => {
        const mut = bucket.mutateIn(docKey);
        assert.instanceOf(mut, MutateInBuilder);
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
      it('should return a Promise', (done) => {
        const result = bucket.prependAsync(strKey, 'y');
        assert.instanceOf(result, Promise);
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

      it('should return a Promise', (done) => {
        const result = bucket.queryAsync(query);
        assert.instanceOf(result, Promise);
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
      it('should return a Promise', (done) => {
        const result = bucket.removeAsync(strKey);
        assert.instanceOf(result, Promise);
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

      it('should return a Promise', (done) => {
        const result = bucket.removeMultiAsync(keys);
        assert.instanceOf(result, Promise);
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

      it('should throw if any keys are not strings', (done) => {
        assert.throws(() => {
          bucket.removeMultiAsync(badKeys);
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

      it('should return a Promise', (done) => {
        const result = bucket.replaceAsync(numKey, newValue);
        assert.instanceOf(result, Promise);
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
      it('should return a Promise', (done) => {
        const result = bucket.touchAsync(numKey, 1000);
        assert.instanceOf(result, Promise);
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
      it('should return a Promise', (done) => {
        bucket.getAndLockAsync(strKey)
          .then((res) => {
            const result = bucket.unlockAsync(strKey, res.cas);
            assert.instanceOf(result, Promise);
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

      it('should return a Promise', (done) => {
        const result = bucket.upsertAsync(strKey, newStr);
        assert.instanceOf(result, Promise);
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
      const docs = {
        a: 42,
        b: 24
      };

      const newDocs = {
        a: 42,
        b: 24
      }
      newDocs[strKey] = testStr;

      it('should return a Promise', (done) => {
        const result = bucket.upsertMultiAsync(docs);
        assert.instanceOf(result, Promise);
        done();
      });

      it('should throw if docs not an object', (done) => {
        assert.throws(() => {
          bucket.upsertMultiAsync(42)
            .then((res) => {
              assert.fail();
            });
        }, TypeError);
        done();
      });

      it('should throw if docs is an array', (done) => {
        assert.throws(() => {
          bucket.upsertMultiAsync([42])
            .then((res) => {
              assert.fail();
            });
        }, TypeError);
        done();
      });

      it('should throw if docs is null', (done) => {
        assert.throws(() => {
          bucket.upsertMultiAsync(null)
            .then((res) => {
              assert.fail();
            });
        }, TypeError);
        done();
      });

      it('should return summary with array of keys', (done) => {
        bucket.upsertMultiAsync(newDocs)
          .then((res) => {
            assert.isArray(res.keys);
            done();
          });
      });

      it('should return summary with key for all docs', (done) => {
        bucket.upsertMultiAsync(newDocs)
          .then((res) => {
            assert.include(res.keys, 'a');
            assert.include(res.keys, 'b');
            assert.include(res.keys, strKey);
            done();
          });
      });

      it('should return summary with hasErrors Boolean flag', (done) => {
        bucket.upsertMultiAsync(newDocs)
          .then((res) => {
            assert.isBoolean(res.hasErrors);
            done();
          });
      });

      it('should return summary with hasErrors=false when no error', (done) => {
        bucket.upsertMultiAsync(docs)
          .then((res) => {
            assert.isFalse(res.hasErrors);
            done();
          });
      });

      it('should return summary with object of results', (done) => {
        bucket.upsertMultiAsync(newDocs)
          .then((res) => {
            assert.isObject(res.results);
            done();
          });
      });

      it('should return summary with result for all docs', (done) => {
        bucket.upsertMultiAsync(newDocs)
          .then((res) => {
            assert.deepProperty(res, 'results.a');
            assert.deepProperty(res, 'results.b');
            assert.deepProperty(res, 'results.' + strKey);
            done();
          });
      });

      it('should insert key-values from Map', (done) => {
        const docsMap = new Map();
        docsMap.set('a', 42);
        docsMap.set('b', 24);

        bucket.upsertMultiAsync(docsMap)
          .then((res) => {
            assert.isOk(res);
            return bucket.getMultiAsync(['a', 'b'])
          })
          .then((res) => {
            assert.property(res, 'a');
            assert.property(res, 'b');
            assert.strictEqual(res.a.value, docsMap.get('a'));
            assert.strictEqual(res.b.value, docsMap.get('b'));
            done();
          });
      });

      it('should insert key-values from object', (done) => {
        bucket.upsertMultiAsync(docs)
          .then((res) => {
            assert.isOk(res);
            return bucket.getMultiAsync(['a', 'b'])
          })
          .then((res) => {
            assert.property(res, 'a');
            assert.property(res, 'b');
            assert.strictEqual(res.a.value, docs.a);
            assert.strictEqual(res.b.value, docs.b);
            done();
          });
      });

      it('should insert new docs when there are old docs', (done) => {
        bucket.upsertMultiAsync(newDocs)
          .then((res) => {
            assert.isTrue(res.results.a.success);
            assert.isTrue(res.results.b.success);
            assert.isTrue(res.results[strKey].success);
            return bucket.getMultiAsync(['a', 'b', strKey]);
          })
          .then((res) => {
            assert.property(res, 'a');
            assert.property(res, 'b');
            assert.property(res, strKey);
            assert.strictEqual(res.a.value, newDocs.a);
            assert.strictEqual(res.b.value, newDocs.b);
            assert.strictEqual(res[strKey].value, newDocs[strKey]);
            done();
          });
      });

    });
  });
});
