'use strict';

const assert = require('chai').assert;

const ClusterManager = require('../../lib/clustermgr');
const couchbase = require('../../lib/couchbase');

test(require('bluebird'), 'bluebird');
test(Promise, 'native');
test(require('kew'), 'kew');
test(require('q'), 'Q');
test(require('rsvp'), 'Rsvp');

function test(library, libraryName) {
  couchbase.setPromiseLib(library);

  describe(`${libraryName} - ClusterManager`, () => {
    after(() => {
      couchbase.revertPromiseLib();
    });

    let cluster, mgr;

    beforeEach((done) => {
      cluster = new couchbase.Mock.Cluster;
      mgr = cluster.manager();
      done();
    });

    describe('#constructor', () => {
      it('should throw if no clustermgr provided', (done) => {
        assert.throws(() => {
          const test = new ClusterManager();
        });
        done();
      });

      it('should not throw if clustermgr provided', (done) => {
        assert.doesNotThrow(() => {
          const test = new ClusterManager({});
        });
        done();
      });
    });

    // It's probably unnecessary to actually test the underlying functionality
    // of Couchbase.  Just make sure everything is getting passed through to
    // the native ClusterManager as expected.

    describe('#createBucket', () => {
      it('should execute', (done) => {
        mgr.createBucket('test', null, (err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#createBucketAsync', () => {
      it('should return a Promise', (done) => {
        const result = mgr.createBucketAsync('test', null);
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.createBucketAsync('test', null)
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#listBuckets', () => {
      it('should execute', (done) => {
        mgr.listBuckets((err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#listBucketsAsync', () => {
      it('should return a Promise', (done) => {
        const result = mgr.listBucketsAsync();
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.listBucketsAsync()
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#removeBucket', () => {
      it('should execute', (done) => {
        mgr.removeBucket('test', (err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#removeBucketAsync', () => {
      it('should return a Promise', (done) => {
        const result = mgr.removeBucketAsync('test');
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.removeBucketAsync('test')
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#getUsers', () => {
      it('should execute', (done) => {
        mgr.getUsers('test', (err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#getUsersAsync', () => {
      it('should return a Promise', (done) => {
        const result = mgr.getUsersAsync('test');
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.getUsersAsync('test')
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#getUser', () => {
      it('should execute', (done) => {
        mgr.getUser('test', 'test', (err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#getUserAsync', () => {
      it('should return a Promise', (done) => {
        const result = mgr.getUserAsync('test', 'test');
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.getUserAsync('test', 'test')
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#removeUser', () => {
      it('should execute', (done) => {
        mgr.removeUser('test', 'test', (err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#removeUserAsync', () => {
      it('should return a Promise', (done) => {
        const result = mgr.removeUserAsync('test', 'test');
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.removeUserAsync('test', 'test')
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#upsertUser', () => {
      it('should execute', (done) => {
        mgr.upsertUser('test', 'test', {}, (err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#upsertUserAsync', () => {
      it('should return a Promise', (done) => {
        const result = mgr.upsertUserAsync('test', 'test', {});
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        mgr.upsertUserAsync('test', 'test', {})
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });
  });
}
