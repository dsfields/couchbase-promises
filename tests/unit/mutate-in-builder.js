'use strict';

const chai = require('chai');
const Promise = require('bluebird');

const MutateInBuilder = require('../../lib/mutate-in-builder');

const assert = chai.assert;

describe('MutateInBuilder', () => {
  describe('prototype', () => {
    const proto = MutateInBuilder.prototype;

    describe('#executeAsync', () => {
      it('should be a function', () => {
        assert.isFunction(proto.executeAsync);
      });

      it('should return an instance of Promise', () => {
        const mut = new MutateInBuilder({ execute: (callback) => callback() });
        const res = mut.executeAsync();
        assert.instanceOf(res, Promise);
      });
    });
  });
});
