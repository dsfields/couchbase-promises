'use strict';

const assert = require('chai').assert;

const ClusterManager = require('../../lib/clustermgr');
const couchbase = require('../../lib/couchbase');

test(require('bluebird'), 'bluebird');
test(Promise, 'native');
test(require('kew'), 'kew');
test(require('Q'), 'Q');
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
  });
}
