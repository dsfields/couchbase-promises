'use strict';

const chai = require('chai');

const ClusterManager = require('../../lib/clustermgr');

const assert = chai.assert;

describe('ClusterManager', () => {
  describe('prototype', () => {
    const proto = ClusterManager.prototype;

    describe('#createBucketAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.createBucketAsync);
      });
    });

    describe('#listBucketsAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.listBucketsAsync);
      });
    });

    describe('#removeBucketAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.removeBucketAsync);
      });
    });

  });
});
