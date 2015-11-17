'use strict';

var chai = require('chai');
var assert = chai.assert;

var BucketManager = require('../../lib/bucketmgr');

describe('BucketManager', function() {
  describe('prototype', function() {
    var proto = BucketManager.prototype;

    describe('#flushAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.flushAsync);
      });
    });

    describe('#getDesignDocumentAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.getDesignDocumentAsync);
      });
    });

    describe('#getDesignDocumentsAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.getDesignDocumentsAsync);
      });
    });

    describe('#insertDesignDocumentAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.insertDesignDocumentAsync);
      });
    });

    describe('#removeDesignDocumentAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.removeDesignDocumentAsync);
      });
    });

    describe('#upsertDesignDocumentAsync()', function() {
      it('should be a function', function() {
        assert.isFunction(proto.upsertDesignDocumentAsync);
      });
    });

  });
});
