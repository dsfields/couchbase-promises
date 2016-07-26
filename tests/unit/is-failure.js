'use strict';

const assert = require('chai').assert;

const isFailure = require('../../lib/is-failure');

describe('#isFailure', () => {
  it('should be false if err is undefined', () => {
    const result = isFailure(undefined);
    assert.isFalse(result);
  });

  it('should be false if err is null', () => {
    const result = isFailure(null);
    assert.isFalse(result);
  });

  it('should be false if err is Boolean value false', () => {
    const result = isFailure(false);
    assert.isFalse(result);
  });

  it('should be false if err is integer value 0', () => {
    const result = isFailure(0);
    assert.isFalse(result);
  });

  it('should be false if err.code is integer value 0', () => {
    const result = isFailure({ code: 0 });
    assert.isFalse(result);
  });

  it('should be true if err is a keyed object instance', () => {
    const result = isFailure({ code: 1 });
    assert.isTrue(result);
  });

  it('should be true if err is Boolean true', () => {
    const result = isFailure(true);
    assert.isTrue(result);
  });

  it('should be true if err is number ne 0', () => {
    const result = isFailure(1);
    assert.isTrue(result);
  });

  it('should throw if err is string', () => {
    assert.throws(() => {
      isFailure('test');
    }, TypeError);
  });

  it('should throw if err is symbol', () => {
    assert.throws(() => {
      isFailure(Symbol('test'));
    }, TypeError);
  });

  it('should throw if err is function', () => {
    assert.throws(() => {
      isFailure(() => 1);
    }, TypeError);
  });
});
