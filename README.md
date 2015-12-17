# Couchbase Promises

[![Build Status](https://secure.travis-ci.org/dsfields/couchbase-promises.svg)](https://travis-ci.org/dsfields/couchbase-promises)

## Overview
Just like the [Couchbase Node.js SDK](http://developer.couchbase.com/documentation/server/4.0/sdks/node-2.0/introduction.html), but with the addition of `*Async()` methods that return A+ Promises for all methods that contain a Node.js callback parameter.  Both the normal Couchnode and the mock Couchnode APIs have been fully promisified.  This module functions as a drop-in replacement for the [couchbase](https://www.npmjs.com/package/couchbase) module.

The current version supports Couchbase Node.js SDK version 2.1.2.

Promises are created using the [Bluebird](http://bluebirdjs.com/docs/getting-started.html) Promises library.  If you absolutely must use native ECMAScript Promises, then have a look at [couchbase-es-promises](https://www.npmjs.com/package/couchbase-promises).  I _highly_ recommend avoiding couchbase-es-promises, as Bluebird is compatible with native promises, and offers [an order of magnitude more performance](https://github.com/petkaantonov/bluebird/tree/master/benchmark).

## General Usage
Usage is almost exactly the same as the native SDK, but with the added ability to use Promises instead of callbacks.

A user repository module with a simple lookup...

```js
let couchbase = require('couchbase-promises');
let cluster = new couchbase.Cluster('couchbase://127.0.0.1');
let bucket = cluster.openBucket();

function UserNotFoundError() {
  Error.call(this);
  Error.captureStackTrace(this, UserNotFoundError);
  this.message = "User not found.";
}

module.exports = {
  UserNotFoundError: UserNotFoundError,
  getUserAsync: function(userId) {
    return bucket.getAsync(userId)
      .then(function(result) {
        return {
          user: result.value,
          meta: {
            etag: result.cas
          }
        };
      }).catch(couchbase.Error, function(e) {
        if (e.code === couchbase.errors.keyNotFound)
          throw new UserNotFoundError();

        throw e;
      });
  }
};
```
