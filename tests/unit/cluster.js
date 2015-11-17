'use strict';

var chai = require('chai');
var assert = chai.assert;

var Cluster = require('../../lib/cluster');

describe('Cluster', function() {
  describe('prototype', function() {
    var proto = Cluster.prototype;

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
