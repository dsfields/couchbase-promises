'use strict';

var chai = require('chai');
var assert = chai.assert;

var Promise = require('bluebird');
var promisify = require('../../lib/promisify');

var square = function(value, callback) {
  if (!value || typeof value !== 'number')
    callback(new Error('Value not a number.'));
  else
    callback(null, value * value);
};

var squareAsync = function(value) {
  return promisify(square, value);
};

describe('promisify', function() {

  describe('result', function() {
    it('should return a Promise', function() {
      var result = squareAsync(2);
      assert.instanceOf(result, Promise);
    });
  });

  describe('fulfillment function', function() {
    it('should fulfill a result when not rejected', function() {
      squareAsync(2)
        .then(function(res) {
          assert.equal(res, 4);
        })
        .catch(function(e) {
          assert.fail();
        });

    });
    it ('should throw an error when rejected', function() {
      squareAsync(2)
        .then(function(res) {
          assert.fail();
        })
        .catch(function(e) {
          assert.ok(e);
        });
    });
  });

});
