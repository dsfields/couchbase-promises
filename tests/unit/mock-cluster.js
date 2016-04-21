'use strict';

const chai = require('chai');

const couchbase = require('../../lib/couchbase');

const assert = chai.assert;
const MockCluster = couchbase.Mock.Cluster;

describe('MockCluster', () => {
  describe('prototype', () => {
    const proto = MockCluster.prototype;

    describe('#managerAsync()', () => {
      it('should be undefined', () => {
        assert.isUndefined(proto.managerAsync);
      });
    });

    describe('#openBucketAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.openBucketAsync);
      });
    });

  });
});
