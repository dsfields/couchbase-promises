'use strict';

var chai = require('chai');
var assert = chai.assert;

var ClusterManager = require('../../lib/clustermgr');

describe('ClusterManager', function() {
  describe('prototype', function() {
    var proto = ClusterManager.prototype;

    describe('#createBucketAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.createBucketAsync);
      });
    });

    describe('#listBucketsAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.listBucketsAsync);
      });
    });

    describe('#removeBucketAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.removeBucketAsync);
      });
    });

  });
});
