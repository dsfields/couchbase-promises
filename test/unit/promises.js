'use strict';

const assert = require('chai').assert;
const Bluebird = require('bluebird');
const Kew = require('kew');
const Q = require('q');
const Rsvp = require('rsvp');

const Promises = require('../../lib/promises');
const promisify = Promises.promisify;
const promisifyMulti = Promises.promisifyMulti;

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

describe('Promises', () => {

  Promises.revert();

  describe('#Promise', () => {
    it('should return a Bluebird Promise by default', (done) => {
      assert.strictEqual(Promises.Promise, Bluebird);
      done();
    });
  });

  describe('#set', () => {
    beforeEach(() => {
      Promises.revert();
    });

    it('should throw if promise is undefined', () => {
      assert.throws(() => {
        Promises.set(undefined);
      }, TypeError);
    });

    it('should throw if lib has no Promise constructor', () => {
      assert.throws(() => {
        Promises.set({ all: function(){} });
      }, TypeError);
    });

    it('should throw if promise.all not a function', () => {
      assert.throws(() => {
        function TestPromise() {};
        Promises.set(TestPromise);
      }, TypeError);
    });

    it('should pass if valid Promise', (done) => {
      assert.doesNotThrow(() => {
        function TestPromise() {};
        TestPromise.all = function() {};
        Promises.set(TestPromise);
        done();
      });
    });

    it('should pass if passed Bluebird', (done) => {
      assert.doesNotThrow(() => {
        Promises.set(Bluebird);
        done();
      });
    });

    it('should pass if passed native Promise', (done) => {
      assert.doesNotThrow(() => {
        Promises.set(Promise);
        done();
      });
    });

    it('should pass if passed Q', (done) => {
      assert.doesNotThrow(() => {
        Promises.set(Q);
        done();
      });
    });

    it('should pass if passed Rsvp', (done) => {
      assert.doesNotThrow(() => {
        Promises.set(Rsvp);
        done();
      });
    });

    it('should pass if passed Kew', (done) => {
      assert.doesNotThrow(() => {
        Promises.set(Kew);
        done();
      });
    });

    it('should set Promise to constructor', (done) => {
      function TestPromise() {};
      TestPromise.all = function() {};
      Promises.set(TestPromise);
      assert.strictEqual(Promises.Promise, TestPromise);
      done();
    });
  });

  describe('#revert', () => {
    it('should set constructor to Bluebird', (done) => {
      Promises.revert();
      assert.strictEqual(Promises.Promise, Bluebird);
      done();
    });

    it('should set library to Bluebird', (done) => {
      Promises.revert();
      assert.strictEqual(Promises.library, Bluebird);
      done();
    });
  });

  describe('#promisify', () => {
    it('should return a Promise', (done) => {
      const result = squareAsync(2);
      assert.instanceOf(result, Promises.Promise);
      done();
    });

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

  describe('#promisifyNativeMulti', () => {
    let originalArgs;
    const originalErrors = 1;
    const originalResult = {
      foo: { cas: 123, value: { bar: 42 } },
      baz: { error: new Error('Imma error') }
    };

    const original = function() {
      let callback;

      for (let i = 0; i < arguments.length; i++) {
        const val = arguments[i];
        if (i === arguments.length - 1) callback = val;
        else originalArgs.push(val);
      }

      callback(originalErrors, originalResult);
    };

    beforeEach(() => {
      originalArgs = [];
    });

    it('should return a Promise', (done) => {
      const result = Promises.promisifyNativeMulti(original, 42);
      assert.instanceOf(result, Promises.Promise);
      done();
    });

    it('should call original with all arguments except undefined', (done) => {
      Promises.promisifyNativeMulti(original, 42, undefined, 'foo')
        .then(() => {
          assert.lengthOf(originalArgs, 2);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should reject when err is not a number and is failure', (done) => {
      const throwsError = function(callback) {
        callback(new Error('Imma error'));
      };

      Promises.promisifyNativeMulti(throwsError)
        .then(() => {
          done(new Error('I should not have been called.'));
        })
        .catch((err) => {
          assert.isOk(err);
          done();
        });
    });

    it('should resolve with hasError=true when err count > 0', (done) => {
      Promises.promisifyNativeMulti(original)
        .then((res) => {
          assert.isTrue(res.hasErrors);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should resolve with errors count', (done) => {
      Promises.promisifyNativeMulti(original)
        .then((res) => {
          assert.strictEqual(res.errors, originalErrors);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should resolve with results', (done) => {
      Promises.promisifyNativeMulti(original)
        .then((res) => {
          assert.strictEqual(res.results, originalResult);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('#promisifyMulti', () => {
    const squareMultiAsync = function(value) {
      return promisifyMulti.call({}, square, 2);
    };

    const failboat = function(callback) {
      process.nextTick(() => {
        callback({ message: 'Foo' }, null);
      });
    };

    const failboatAsync = function() {
      return promisifyMulti.call({}, failboat);
    };

    it('should return a Promise', (done) => {
      const result = squareMultiAsync(2);
      assert.instanceOf(result, Promises.Promise);
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
