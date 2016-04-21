'use strict';

const chai = require('chai');
const assert = chai.assert;

const Promise = require('bluebird');
const promisify = require('../../lib/promisify');

const square = (value, callback) => {
  if (!value || typeof value !== 'number')
    callback(new Error('Value not a number.'));
  else
    callback(null, value * value);
};

const squareAsync = (value) => {
  return promisify(square, value);
};

describe('promisify', () => {

  describe('result', () => {
    it('should return a Promise', () => {
      const result = squareAsync(2);
      assert.instanceOf(result, Promise);
    });
  });

  describe('fulfillment function', () => {
    it('should fulfill a result when not rejected', () => {
      squareAsync(2)
        .then((res) => {
          assert.equal(res, 4);
        })
        .catch((e) => {
          assert.fail();
        });

    });
    it ('should throw an error when rejected', () => {
      squareAsync(2)
        .then((res) => {
          assert.fail();
        })
        .catch((e) => {
          assert.ok(e);
        });
    });
  });

});
