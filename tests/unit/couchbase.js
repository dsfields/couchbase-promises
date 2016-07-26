'use strict';

const assert = require('chai').assert;
const nativeCouch = require('couchbase');

const Cluster = require('../../lib/cluster');
const couchbase = require('../../lib/couchbase');

describe('Couchbase', () => {
  describe('#Cluster', () => {
    it('should reference Cluster', (done) => {
      assert.strictEqual(couchbase.Cluster, Cluster);
      done();
    });
  });

  describe('#N1qlQuery', () => {
    it('should reference native couchbase.N1qlQuery', (done) => {
      assert.strictEqual(couchbase.N1qlQuery, nativeCouch.N1qlQuery);
      done();
    });
  });

  describe('#SpatialQuery', () => {
    it('should reference native couchbase.SpatialQuery', (done) => {
      assert.strictEqual(couchbase.SpatialQuery, nativeCouch.SpatialQuery);
      done();
    });
  });

  describe('#ViewQuery', () => {
    it('should reference native couchbase.ViewQuery', (done) => {
      assert.strictEqual(couchbase.ViewQuery, nativeCouch.ViewQuery);
      done();
    });
  });

  describe('#Mock', () => {
    const mock = couchbase.Mock;
    const nmock = nativeCouch.Mock;
    describe('#N1qlQuery', () => {
      it('should reference native couchbase.N1qlQuery', (done) => {
        assert.strictEqual(mock.N1qlQuery, nmock.N1qlQuery);
        done();
      });
    });

    describe('#SpatialQuery', () => {
      it('should reference native couchbase.SpatialQuery', (done) => {
        assert.strictEqual(mock.SpatialQuery, nmock.SpatialQuery);
        done();
      });
    });

    describe('#ViewQuery', () => {
      it('should reference native couchbase.ViewQuery', (done) => {
        assert.strictEqual(mock.ViewQuery, nmock.ViewQuery);
        done();
      });
    });

    describe('#Error', () => {
      it('should reference native couchbase.Error', (done) => {
        assert.strictEqual(mock.Error, nmock.Error);
        done();
      });
    });

    describe('#errors', () => {
      it('should reference native couchbase.errors', (done) => {
        assert.strictEqual(mock.errors, nmock.errors);
        done();
      });
    });
  });

  describe('#Error', () => {
    it('should reference native couchbase.Error', (done) => {
      assert.strictEqual(couchbase.Error, nativeCouch.Error);
      done();
    });
  });

  describe('#errors', () => {
    it('should reference native couchbase.errors', (done) => {
      assert.strictEqual(couchbase.errors, nativeCouch.errors);
      done();
    });
  });
});
