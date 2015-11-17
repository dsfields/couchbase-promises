'use strict';

var promisify = require('./promisify');

function BucketManager(bucketmgr) {
  if (!bucketmgr) throw 'No bucket manager was provided.';
  this._bucketmgr = bucketmgr;
}

BucketManager.prototype.flush = function(callback) {
  return this._bucketmgr.flush(callback);
};

BucketManager.prototype.flushAsync = function() {
  return promisify(this.flush);
};

BucketManager.prototype.getDesignDocument = function(name, callback) {
  return this._bucketmgr.getDesignDocument(name, callback);
};

BucketManager.prototype.getDesignDocumentAsync = function(name) {
  return promisify(this.getDesignDocument, name);
};

BucketManager.prototype.getDesignDocuments = function(callback) {
  return this._bucketmgr.getDesignDocuments(callback);
};

BucketManager.prototype.getDesignDocumentsAsync = function() {
  return promisify(this.getDesignDocuments);
};

BucketManager.prototype.insertDesignDocument = function(name, data, callback) {
  return this._bucketmgr.insertDesignDocument(name, data, callback);
};

BucketManager.prototype.insertDesignDocumentAsync = function(name, data) {
  return promisify(this.insertDesignDocument, name, data);
};

BucketManager.prototype.removeDesignDocument = function(name, callback) {
  return this._bucketmgr.removeDesignDocument(name, callback);
};

BucketManager.prototype.removeDesignDocumentAsync = function(name) {
  return promisify(this.removeDesignDocument, name);
};

BucketManager.prototype.upsertDesignDocument = function(name, data, callback) {
  return this._bucketmgr.upsertDesignDocument(name, data, callback);
};

BucketManager.prototype.upsertDesignDocumentAsync = function(name, data) {
  return promisify(this.upsertDesignDocument, name, data);
};

module.exports = BucketManager;
