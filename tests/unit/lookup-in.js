'use strict';

const assert = require('chai').assert;

const couchbase = require('../../lib/couchbase');
const LookupInBuilder = require('../../lib/lookup-in');
const MockLookupInBuilder = require('../../lib/mock-partials').LookupInBuilder;

test(require('bluebird'), 'bluebird');
test(Promise, 'native');
test(require('kew'), 'kew');
test(require('Q'), 'Q');
test(require('rsvp'), 'Rsvp');

function test(library, libraryName) {
  couchbase.setPromiseLib(library);

  describe(`${libraryName} - LookupInBuilder`, () => {
    after(() => {
      couchbase.revertPromiseLib();
    });

    const testKey = 'test'
    const testDoc = {
      foo: 'bar',
      baz: {
        answer: 42,
        question: null
      }
    };

    let cluster, bucket, mock, builder;

    beforeEach((done) => {
      cluster = new couchbase.Mock.Cluster();
      bucket = cluster.openBucket();
      mock = new MockLookupInBuilder(bucket, 'test');
      builder = new LookupInBuilder(mock);

      bucket.insert(testKey, testDoc, (err, res) => {
        done();
      });
    });

    describe('#constructor', () => {
      it('should throw if no native builder provided', (done) => {
        assert.throws(() => {
          const test = new LookupInBuilder();
        }, TypeError);
        done();
      });
    });

    describe('#execute', () => {
      it('should execute', (done) => {
        builder.get('baz.answer').execute((err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#executeAsync', () => {
      it('should return a Promise', (done) => {
        const result = builder.get('baz.answer').executeAsync();
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        builder.get('baz.answer').executeAsync()
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#exists', () => {
      it('should add an exists op', (done) => {
        builder.exists('baz.answer');
        assert.lengthOf(mock.operations, 1);
        const op = mock.operations[0];
        assert.strictEqual(op.name, 'exists');
        done();
      });
    });

    describe('#get', () => {
      it('should add a get op', (done) => {
        builder.get('baz.answer');
        assert.lengthOf(mock.operations, 1);
        const op = mock.operations[0];
        assert.strictEqual(op.name, 'get');
        done();
      });
    });
  });
}
