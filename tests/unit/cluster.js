'use strict';

const chai = require('chai');

const Cluster = require('../../lib/cluster');

const assert = chai.assert;

describe('Cluster', () => {
  describe('prototype', () => {
    const proto = Cluster.prototype;

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
