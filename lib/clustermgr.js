'use strict';

const elv = require('elv');

const { promisify } = require('./promises');


class ClusterManager {

  constructor(clustermgr) {
    const cm = clustermgr;

    if (!elv(cm)) {
      throw new TypeError('No native cluster manager was provided.');
    }

    //
    // Add missing mock functions.  Super annoying I have to do this.  I'm
    // really hoping the Couchbase team fixes this.
    //

    if (typeof clustermgr.createBucket !== 'function') {
      cm.createBucket = function (name, opts, callback) {
        setImmediate(() => {
          callback(null, true);
        });
      };
    }

    if (typeof clustermgr.removeBucket !== 'function') {
      cm.removeBucket = function (name, callback) {
        setImmediate(() => {
          callback(null, true);
        });
      };
    }

    this._clustermgr = clustermgr;
  }


  createBucket(name, opts, callback) {
    return this._clustermgr.createBucket(name, opts, callback);
  }


  createBucketAsync(name, opts) {
    return promisify.call(this, this.createBucket, name, opts);
  }


  getUser(domain, userid, callback) {
    return this._clustermgr.getUser(domain, userid, callback);
  }


  getUserAsync(domain, userid) {
    return promisify.call(this, this.getUser, domain, userid);
  }


  listBuckets(callback) {
    return this._clustermgr.listBuckets(callback);
  }


  listBucketsAsync() {
    return promisify.call(this, this.listBuckets);
  }


  removeBucket(name, callback) {
    return this._clustermgr.removeBucket(name, callback);
  }


  removeBucketAsync(name) {
    return promisify.call(this, this.removeBucket, name);
  }

  removeUser(domain, userid, callback) {
    return this._clustermgr.removeUser(domain, userid, callback);
  }


  removeUserAsync(domain, userid) {
    return promisify.call(this, this.removeUser, domain, userid);
  }


  upsertUser(domain, userid, settings, callback) {
    return this._clustermgr.upsertUser(domain, userid, settings, callback);
  }


  upsertUserAsync(domain, userid, settings) {
    return promisify.call(this, this.upsertUser, domain, userid, settings);
  }

}

module.exports = ClusterManager;
