'use strict';

var chai = require('chai');
var assert = chai.assert;

var couchbase = require('../../lib/couchbase');
var MockCluster = couchbase.Mock.Cluster;

describe('MockCluster', function() {
  describe('prototype', function() {
    var proto = MockCluster.prototype;

    describe('#managerAsync()', function() {
      it('should be undefined', function() {
        assert.isUndefined(proto.managerAsync);
      });
    });

    describe('#openBucketAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.openBucketAsync);
      });
    });

  });
});
