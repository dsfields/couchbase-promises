'use strict';

const chai = require('chai');
const Promise = require('bluebird');

const LookupInBuilder = require('../../lib/lookup-in-builder');

const assert = chai.assert;

describe('LookupInBuilder', () => {
  describe('prototype', () => {
    const proto = LookupInBuilder.prototype;

    describe('#executeAsync', () => {
      it('should be a function', () => {
        assert.isFunction(proto.executeAsync);
      });

      it('should return an instance of Promise', () => {
        const look = new LookupInBuilder({ execute: (callback) => callback() });
        const res = look.executeAsync();
        assert.instanceOf(res, Promise);
      });
    });
  });
});
