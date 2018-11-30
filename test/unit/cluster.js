'use strict';

const assert = require('chai').assert;

const Bucket = require('../../lib/bucket');
const Cluster = require('../../lib/cluster');
const ClusterManager = require('../../lib/clustermgr');
const CouchbaseError = require('../../lib/couchbase').Error;

describe('Cluster', () => {
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
});
