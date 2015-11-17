'use strict';

var chai = require('chai');
var assert = chai.assert;

var Bucket = require('../../lib/bucket');

describe('Bucket', function() {
  describe('prototype', function() {
    var proto = Bucket.prototype;

    describe('#appendAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.appendAsync);
      });
    });

    describe('#counterAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.counterAsync);
      });
    });

    describe('#getAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.getAsync);
      });
    });

    describe('#getAndLockAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.getAndLockAsync);
      });
    });

    describe('#getAndTouchAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.getAndTouchAsync);
      });
    });

    describe('#getMultiAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.getMultiAsync);
      });
    });

    describe('#getReplicaAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.getReplicaAsync);
      });
    });

    describe('#insertAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.insertAsync);
      });
    });

    describe('#managerAsync()', function() {
      it('should be undefined', function() {
        assert.isUndefined(proto.managerAsync);
      });
    });

    describe('#prependAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.prependAsync);
      });
    });

    describe('#queryAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.queryAsync);
      });
    });

    describe('#removeAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.removeAsync);
      });
    });

    describe('#replaceAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.replaceAsync);
      });
    });

    describe('#setTranscoderAsync()', function() {
      it('should be undefined', function() {
        assert.isUndefined(proto.setTranscoderAsync);
      });
    });

    describe('#touchAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.touchAsync);
      });
    });

    describe('#unlockAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.unlockAsync);
      });
    });

    describe('#upsertAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.upsertAsync);
      });
    });

  });
});
