'use strict';

const assert = require('chai').assert;

const couchbase = require('../../lib/couchbase');
const BucketManager = require('../../lib/bucketmgr.js');

test(require('bluebird'), 'bluebird');
test(Promise, 'native');
test(require('kew'), 'kew');
test(require('Q'), 'Q');
test(require('rsvp'), 'Rsvp');

function test(library, libraryName) {
  couchbase.setPromiseLib(library);

  describe(`${libraryName} - BucketManager`, () => {
    after(() => {
      couchbase.revertPromiseLib();
    });

    let cluster, bucket, mgr;
    const testDDoc = 'testDDoc';

    beforeEach((done) => {
      cluster = new couchbase.Mock.Cluster();
      bucket = cluster.openBucket();
      mgr = bucket.manager();

      const ddoc = {
        views: {
          test: {
            map: 'function(doc, meta) { emit(doc, null); }'
          }
        }
      };

      mgr.insertDesignDocument(testDDoc, ddoc, (derr, dres) => {
        if (derr) throw derr;
        done();
      });
    });

    describe('#constructor', () => {
      it('should throw if no bucketmgr is supplied', (done) => {
        assert.throws(() => {
          const test = new BucketManager();
        }, TypeError);
        done();
      });

      it('should not throw if provided a bucketmgr', (done) => {
        assert.doesNotThrow(() => {
          const test = new BucketManager({});
        });
        done();
      });
    });

    // It's probably unnecessary to actually test the underlying functionality
    // of Couchbase.  Just make sure everything is getting passed through to
    // the native BucketManager as expected.

    describe('#buildDeferredIndexes', () => {
      it('should execute', (done) => {
        mgr.buildDeferredIndexes((err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#buildDeferredIndexesAsync', () => {
      it('should return Promise', (done) => {
        const result = mgr.buildDeferredIndexesAsync();
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.buildDeferredIndexesAsync()
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#createIndex', () => {
      it('should execute', (done) => {
        mgr.createIndex('test', ['test'], null, (err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#createIndexAsync', () => {
      it('should return Promise', (done) => {
        const result = mgr.createIndexAsync('test', ['test'], null);
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.createIndexAsync('test', ['test'], null)
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#createPrimaryIndex', () => {
      it('should execute', (done) => {
        mgr.createPrimaryIndex(null, (err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#createPrimaryIndexAsync', () => {
      it('should return Promise', (done) => {
        const result = mgr.createPrimaryIndexAsync(null);
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.createPrimaryIndexAsync(null)
          .then((res) => {;
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#dropIndex', () => {
      it('should execute', (done) => {
        mgr.dropIndex('test', null, (err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#dropIndexAsync', () => {
      it('should return Promise', (done) => {
        const result = mgr.dropIndexAsync('test', null);
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.dropIndexAsync('test', null)
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#dropPrimaryIndex', () => {
      it('should execute', (done) => {
        mgr.dropPrimaryIndex(null, (err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#dropPrimaryIndexAsync', () => {
      it('should return Promise', (done) => {
        const result = mgr.dropPrimaryIndexAsync(null);
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.dropPrimaryIndexAsync(null)
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#flush', () => {
      it('should execute', (done) => {
        mgr.flush((err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#flushAsync', () => {
      it('should return Promise', (done) => {
        const result = mgr.flushAsync();
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.flushAsync()
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#getDesignDocument', () => {
      it('should execute', () => {
        mgr.getDesignDocument(testDDoc, (err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#getDesignDocumentAsync', () => {
      it('should return Promise', (done) => {
        const result = mgr.getDesignDocumentAsync(testDDoc);
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.getDesignDocumentAsync(testDDoc)
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#getDesignDocuments', () => {
      it('should execute', () => {
        mgr.getDesignDocuments((err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#getDesignDocumentsAsync', () => {
      it('should return Promise', (done) => {
        const result = mgr.getDesignDocumentsAsync();
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.getDesignDocumentsAsync()
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#getIndexes', () => {
      it('should execute', () => {
        mgr.getIndexes((err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#getIndexesAsync', () => {
      it('should return Promise', (done) => {
        const result = mgr.getIndexesAsync();
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.getIndexesAsync()
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#insertDesignDocument', () => {
      const testData = {
        views: {
          testView: {
            map: 'function(doc, meta) { emit(doc, null); }'
          }
        }
      };

      it('should execute', () => {
        mgr.insertDesignDocument('test', testData, (err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#insertDesignDocumentAsync', () => {
      const testData = {
        views: {
          testView: {
            map: 'function(doc, meta) { emit(doc, null); }'
          }
        }
      };

      it('should return Promise', (done) => {
        const result = mgr.insertDesignDocumentAsync('test', testData);
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.insertDesignDocumentAsync('test', testData)
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#removeDesignDocument', () => {
      it('should execute', () => {
        mgr.removeDesignDocument(testDDoc, (err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#removeDesignDocumentAsync', () => {
      it('should return Promise', (done) => {
        const result = mgr.removeDesignDocumentAsync(testDDoc);
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.removeDesignDocumentAsync(testDDoc)
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#upsertDesignDocument', () => {
      const testData = {
        views: {
          testView: {
            map: 'function(doc, meta) { emit(doc, null); }'
          }
        }
      };

      it('should execute', () => {
        mgr.upsertDesignDocument(testDDoc, testData, (err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#upsertDesignDocumentAsync', () => {
      const testData = {
        views: {
          testView: {
            map: 'function(doc, meta) { emit(doc, null); }'
          }
        }
      };

      it('should return Promise', (done) => {
        const result = mgr.upsertDesignDocumentAsync(testDDoc, testData);
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.upsertDesignDocumentAsync(testDDoc, testData)
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#watchIndexes', () => {
      it('should execute', () => {
        mgr.watchIndexes(['test'], null, (err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#watchIndexesAsync', () => {
      it('should return Promise', (done) => {
        const result = mgr.watchIndexesAsync(['test'], null);
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.watchIndexesAsync(['test'], null)
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });
  });
}
