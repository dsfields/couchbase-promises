# Couchbase Promises

[![Build Status](https://secure.travis-ci.org/dsfields/couchbase-promises.svg)](https://travis-ci.org/dsfields/couchbase-promises)

## Overview
Just like the [Couchbase Node.js SDK](http://developer.couchbase.com/documentation/server/4.5/sdk/nodejs/start-using-sdk.html), but with the addition of `*Async()` methods that return A+ Promises for all methods that contain a Node.js callback parameter.  This module functions as a drop-in replacement for the [couchbase](https://www.npmjs.com/package/couchbase) module.

The current version supports Couchbase Node.js SDK version 2.2.1.

Promises are created using the [Bluebird](http://bluebirdjs.com/docs/getting-started.html) Promises library.  If you absolutely must use native ECMAScript Promises, then have a look at [couchbase-es-promises](https://www.npmjs.com/package/couchbase-es-promises).  I _highly_ recommend avoiding couchbase-es-promises, as Bluebird is compatible with native promises, and offers [an order of magnitude more performance](https://github.com/petkaantonov/bluebird/tree/master/benchmark).

## General Usage
Usage is almost exactly the same as the native SDK, but with the added ability to use Promises instead of callbacks.

A user repository module with a simple lookup...

```js
const couchbase = require('couchbase-promises');
const cluster = new couchbase.Cluster('couchbase://127.0.0.1');
const bucket = cluster.openBucket();

const UserNotFoundError = () => {
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

## Additional Functionality

The the `couchbase` module only provides batch operation support for key lookups (via [`Bucket.prototype.getMulti()`](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.0/Bucket.html#getMulti)).  The `couchbase-promises` module provides a few extra methods on the `Bucket` class for performing batch operations.

##### `Bucket.prototype.insertMultiAsync(docs, options)`

Inserts multiple documents into the bucket.  This method will create individual insert operations for each document using [`Promise.all()`](http://bluebirdjs.com/docs/api/promise.all.html).

__Returns:__ a `Promise` that resolves with a [`Summary`](#summary-class) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

__Parameters__

  * `docs`: a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) or an object where each property name is the key of the document to insert.
  * `options`: an optional object to pass to the native [`insert()`](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.0/Bucket.html#insert) method.

##### `Bucket.prototype.removeMultiAsyc(keys, options)`

Removes multiple documents in the bucket.  This method will create individual remove operations for each key using with `Promisea.all()`.

__Returns:__ a `Promise` that resolves with a [`Summary`](#summary-class) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

__Parameters__

  * `keys`: a [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) or an [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of keys to remove.
  * `options`: an optional object to pass to the native [`remove()`](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.0/Bucket.html#remove) method.

##### `Summary` Class

Contains a summary of a bulk operation.  Keys include:

  * `hasErrors`: a Boolean value indicating whether or not any items failed in the bulk operation.
  * `keys`: an array of keys that were used in the bulk operations.
  * `results`: an object with properties for key used in the bulk operation.
    + `success`: a Boolean value indicating whether or not the the individual operation succeeded.
    + `err`: the error returned from Couchbase if the operation was not successful.
    + `result`: the result object returned from Couchbase.
