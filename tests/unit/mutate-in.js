'use strict';

const assert = require('chai').assert;

const couchbase = require('../../lib/couchbase');
const MutateInBuilder = require('../../lib/mutate-in');
const MockMutateInBuilder = require('../../lib/mock-partials').MutateInBuilder;

test(require('bluebird'), 'bluebird');
test(Promise, 'native');
test(require('kew'), 'kew');
test(require('Q'), 'Q');
test(require('rsvp'), 'Rsvp');

function test(library, libraryName) {
  couchbase.setPromiseLib(library);

  describe(`${libraryName} - MutateInBuilder`, () => {
    after(() => {
      couchbase.revertPromiseLib();
    });

    const testKey = 'test'
    const testDoc = {
      foo: 'bar',
      baz: {
        answer: 42,
        question: null,
        qux: ['foo', 'bar']
      }
    };

    let cluster, bucket, mock, builder;

    beforeEach((done) => {
      cluster = new couchbase.Mock.Cluster();
      bucket = cluster.openBucket();
      mock = new MockMutateInBuilder(bucket, 'test');
      builder = new MutateInBuilder(mock);

      // deep copy
      const doc = JSON.parse(JSON.stringify(testDoc));
      bucket.insert(testKey, doc, (err, res) => {
        done();
      });
    });

    describe('#constructor', () => {
      it('should throw if no native builder provided', (done) => {
        assert.throws(() => {
          const test = new MutateInBuilder();
        }, TypeError);
        done();
      });
    });

    describe('#execute', () => {
      it('should execute', (done) => {
        builder.replace('baz.answer', 24).execute((err, res) => {
          assert.isNotOk(err);
          assert.isOk(res);
          done();
        });
      });
    });

    describe('#executeAsync', () => {
      it('should return a Promise', (done) => {
        const result = builder.replace('baz.answer', 24).executeAsync();
        assert.instanceOf(result, couchbase.Promise);
        done();
      });

      it('should execute', (done) => {
        builder.replace('baz.answer', 24).executeAsync()
          .then((res) => {
            assert.isOk(res);
            done();
          });
      });
    });

    describe('#arrayAddUnique', () => {
      it('should add an arrayAddUnique op', (done) => {
        builder.arrayAddUnique('baz.qux', 'test', false);
        assert.lengthOf(mock.operations, 1);
        const op = mock.operations[0];
        assert.strictEqual(op.name, 'arrayAddUnique');
        done();
      });
    });

    describe('#arrayAppend', () => {
      it('should add an arrayAppend op', (done) => {
        builder.arrayAppend('baz.qux', 'test');
        assert.lengthOf(mock.operations, 1);
        const op = mock.operations[0];
        assert.strictEqual(op.name, 'arrayAppend');
        done();
      });
    });

    describe('#arrayInsert', () => {
      it('should add an arrayInsert op', (done) => {
        builder.arrayInsert('qux.baz', 'test');
        assert.lengthOf(mock.operations, 1);
        const op = mock.operations[0];
        assert.strictEqual(op.name, 'arrayInsert');
        done();
      });
    });

    describe('#arrayPrepend', () => {
      it('should add an arrayPrepend op', (done) => {
        builder.arrayPrepend('baz.qux', 'test', false);
        assert.lengthOf(mock.operations, 1);
        const op = mock.operations[0];
        assert.strictEqual(op.name, 'arrayPrepend');
        done();
      });
    });

    describe('#counter', () => {
      it('should add an counter op', (done) => {
        builder.counter('baz.answer', 1, false);
        assert.lengthOf(mock.operations, 1);
        const op = mock.operations[0];
        assert.strictEqual(op.name, 'counter');
        done();
      });
    });

    describe('#insert', () => {
      it('should add an insert op', (done) => {
        builder.insert('baz.testing.test', 'test', true);
        assert.lengthOf(mock.operations, 1);
        const op = mock.operations[0];
        assert.strictEqual(op.name, 'insert');
        done();
      });
    });

    describe('#remove', () => {
      it('should add an remove op', (done) => {
        builder.remove('baz.answer');
        assert.lengthOf(mock.operations, 1);
        const op = mock.operations[0];
        assert.strictEqual(op.name, 'remove');
        done();
      });
    });

    describe('#replace', () => {
      it('should add an replace op', (done) => {
        builder.replace('baz.answer', 24);
        assert.lengthOf(mock.operations, 1);
        const op = mock.operations[0];
        assert.strictEqual(op.name, 'replace');
        done();
      });
    });

    describe('#upsert', () => {
      it('should add an upsert op', (done) => {
        builder.upsert('baz.answer', 24, false);
        assert.lengthOf(mock.operations, 1);
        const op = mock.operations[0];
        assert.strictEqual(op.name, 'upsert');
        done();
      });
    });
  });
}
