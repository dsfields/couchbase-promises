'use strict';

const assert = require('chai').assert;

const Promise = require('bluebird');
const promisify = require('../../lib/promisify');

const square = function(value, callback) {
  process.nextTick(() => {
    if (!value || typeof value !== 'number')
      callback(new Error('Value not a number.'));
    else
      callback(null, value * value);
  });
};

const squareAsync = function(value) {
  return promisify.call({}, square, value);
};

describe('Promisify', () => {
  describe('result', () => {
    it('should return a Promise', (done) => {
      const result = squareAsync(2);
      assert.instanceOf(result, Promise);
      done();
    });
  });

  describe('fulfillment function', () => {
    it('should fulfill a result when not rejected', (done) => {
      squareAsync(2)
        .then((res) => {
          assert.equal(res, 4);
          done();
        })
        .catch((e) => {
          assert.fail();
          done();
        });
    });

    it('should throw an error when rejected', (done) => {
      squareAsync(2)
        .then((res) => {
          assert.fail();
          done();
        })
        .catch((e) => {
          assert.ok(e);
          done();
        });
    });

    it('should return an array when fullfilled with vector', (done) => {
      const cubes = function(value1, value2, callback) {
        process.nextTick(() => {
          callback(null, Math.pow(value1, 3), Math.pow(value2, 3));
        });
      };

      promisify.call({}, cubes, 2, 3)
        .then((res) => {
          assert.isArray(res);
          assert.lengthOf(res, 2);
          done();
        });
    });
  });

  describe('#multiOp', () => {
    const squareMultiAsync = function(value) {
      return promisify.multiOp.call({}, square, 2);
    };

    const failboat = function(callback) {
      process.nextTick(() => {
        callback({ message: 'Foo' }, null);
      });
    };

    const failboatAsync = function() {
      return promisify.multiOp.call({}, failboat);
    };

    it('should return a Promise', (done) => {
      const result = squareMultiAsync(2);
      assert.instanceOf(result, Promise);
      done();
    });

    it('should fulfill a result', (done) => {
      squareMultiAsync(2)
        .then((res) => {
          assert.isOk(res);
          done();
        })
        .catch((e) => {
          assert.fail();
          done();
        });
    });

    it('should fulfill with an object', (done) => {
      squareMultiAsync(2)
        .then((res) => {
          assert.isObject(res);
          done();
        })
        .catch((e) => {
          assert.fail();
          done();
        });
    });

    it('should fulfill with succcess key', (done) => {
      squareMultiAsync(2)
        .then((res) => {
          assert.property(res, 'success');
          done();
        })
        .catch((e) => {
          assert.fail();
          done();
        });
    });

    it('should fulfill with success as true when not failed', (done) => {
      squareMultiAsync(2)
        .then((res) => {
          assert.isTrue(res.success);
          done();
        })
        .catch((e) => {
          assert.fail();
          done();
        });
    });

    it('should fulfill with success as false when failed', (done) => {
      failboatAsync()
        .then((res) => {
          assert.isFalse(res.success);
          done();
        })
        .catch((e) => {
          assert.fail();
          done();
        });
    });

    it('should fulfill with err key', (done) => {
      failboatAsync()
        .then((res) => {
          assert.property(res, 'err');
          done();
        })
        .catch((e) => {
          assert.fail();
          done();
        });
    });

    it('should fulfill with err set to error when failed', (done) => {
      failboatAsync()
        .then((res) => {
          assert.isObject(res.err);
          done();
        })
        .catch((e) => {
          assert.fail();
          done();
        });
    });

    it('should fulfill with result key', (done) => {
      failboatAsync()
        .then((res) => {
          assert.property(res, 'result');
          done();
        })
        .catch((e) => {
          assert.fail();
          done();
        });
    });

    it('should fulfill with result set to result when succeeded', (done) => {
      squareMultiAsync(2)
        .then((res) => {
          assert.strictEqual(res.result, 4);
          done();
        })
        .catch((e) => {
          assert.fail();
          done();
        });
    })

    it('should not throw an error when rejected', (done) => {
      failboatAsync()
        .then((res) => {
          assert.isOk(res);
          done();
        })
        .catch((e) => {
          assert.fail();
          done();
        });
    });
  });
});
