'use strict';

const chai = require('chai');

const BucketManager = require('../../lib/bucketmgr');

const assert = chai.assert;

describe('BucketManager', () => {
  describe('prototype', () => {
    const proto = BucketManager.prototype;

    describe('#flushAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.flushAsync);
      });
    });

    describe('#getDesignDocumentAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.getDesignDocumentAsync);
      });
    });

    describe('#getDesignDocumentsAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.getDesignDocumentsAsync);
      });
    });

    describe('#insertDesignDocumentAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.insertDesignDocumentAsync);
      });
    });

    describe('#removeDesignDocumentAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.removeDesignDocumentAsync);
      });
    });

    describe('#upsertDesignDocumentAsync()', () => {
      it('should be a function', () => {
        assert.isFunction(proto.upsertDesignDocumentAsync);
      });
    });

  });
});
