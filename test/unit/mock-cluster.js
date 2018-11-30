'use strict';

const assert = require('chai').assert;

const Bucket = require('../../lib/bucket');
const Cluster = require('../../lib/mock-cluster');
const ClusterManager = require('../../lib/clustermgr');
const couchbase = require('../../lib/couchbase');
const CouchbaseError = couchbase.Error;

test(require('bluebird'), 'bluebird');
test(Promise, 'native');
test(require('kew'), 'kew');
test(require('q'), 'Q');
test(require('rsvp'), 'Rsvp');

function test(library, libraryName) {
  couchbase.setPromiseLib(library);

  describe(`${libraryName} - MockCluster`, () => {
    after(() => {
      couchbase.revertPromiseLib();
    });

    describe('#constructor', () => {
      it('should create a Cluster', (done) => {
        const cluster = new Cluster('couchbase://127.0.0.1');
        assert.isOk(cluster);
        done();
      });
    });

    describe('#manager', () => {
      it('should return a ClusterManager', (done) => {
        const cluster = new Cluster('couchbase://127.0.0.1');
        const mgr = cluster.manager();
        assert.instanceOf(mgr, ClusterManager);
        done();
      });
    });

    describe('#openBucket', () => {
      it('should return an instance of a bucket', (done) => {
        const cluster = new Cluster('couchbase://127.0.0.1');
        const bucket = cluster.openBucket('default');
        assert.instanceOf(bucket, Bucket);
        done();
      });
    });

    describe('#query', () => {
      it('should execute', (done) => {
        const cluster = new Cluster('couchbase://127.0.0.1');
        cluster.query('', null, (err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        })
      });
    });

    describe('#queryAsync', () => {
      it('should return a promise', (done) => {
        const cluster = new Cluster('couchbase://127.0.0.1');
        const result = cluster.queryAsync('', null);
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        const cluster = new Cluster('couchbase://127.0.0.1');
        cluster.queryAsync('', null)
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });
  });
}
