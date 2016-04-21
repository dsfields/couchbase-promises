'use strict';

const chai = require('chai');

const Bucket = require('../../lib/bucket');
const LookupInBuilder = require('../../lib/lookup-in-builder');
const MutateInBuilder = require('../../lib/mutate-in-builder');

const assert = chai.assert;

describe('Bucket', () => {
  describe('prototype', () => {
    const proto = Bucket.prototype;

    describe('#appendAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.appendAsync);
      });
    });

    describe('#counterAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.counterAsync);
      });
    });

    describe('#getAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.getAsync);
      });
    });

    describe('#getAndLockAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.getAndLockAsync);
      });
    });

    describe('#getAndTouchAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.getAndTouchAsync);
      });
    });

    describe('#getMultiAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.getMultiAsync);
      });
    });

    describe('#getReplicaAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.getReplicaAsync);
      });
    });

    describe('#insertAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.insertAsync);
      });
    });

    describe('#lookupIn()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.lookupIn);
      });

      it('should return an instance of LookupInBuilder', () => {
        const b = new Bucket({ lookupIn: () => { return {}; } });
        const look = b.lookupIn();
        assert.instanceOf(look, LookupInBuilder);
      });
    });

    describe('#managerAsync()', () => {
      it('should be undefined', () => {
        assert.isUndefined(proto.managerAsync);
      });
    });

    describe('#mutateIn()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.mutateIn);
      });

      it('should return an instance of MutateInBuilder', () => {
        const b = new Bucket({ mutateIn: () => { return {}; } });
        const mut = b.mutateIn(null, null);
        assert.instanceOf(mut, MutateInBuilder);
      });
    });

    describe('#prependAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.prependAsync);
      });
    });

    describe('#queryAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.queryAsync);
      });
    });

    describe('#removeAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.removeAsync);
      });
    });

    describe('#replaceAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.replaceAsync);
      });
    });

    describe('#setTranscoderAsync()', () => {
      it('should be undefined', () => {
        assert.isUndefined(proto.setTranscoderAsync);
      });
    });

    describe('#touchAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.touchAsync);
      });
    });

    describe('#unlockAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.unlockAsync);
      });
    });

    describe('#upsertAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.upsertAsync);
      });
    });
  });
});
