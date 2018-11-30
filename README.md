# couchbase-promises

[![Build Status](https://secure.travis-ci.org/dsfields/couchbase-promises.svg)](https://travis-ci.org/dsfields/couchbase-promises)

__Contents__

  * [Overview](#overview)
  * [Usage](#usage)
  * [API](#api)
    + [Module: `couchbase`](#couchbase)
    + [Class: `Bucket`](#class-bucket)
    + [Class: `Summary`](#class-summary)
    + [Multi-operations](#multi-operations)
    + [Promises](#promises)

## Overview

Just like the [Couchbase Node.js SDK](http://developer.couchbase.com/documentation/server/4.5/sdk/nodejs/start-using-sdk.html), but with the addition of `*Async()` methods that return A+ Promises for all methods that contain a Node.js callback parameter.  This module functions as a drop-in replacement for the [couchbase](https://www.npmjs.com/package/couchbase) module.

Additionally, this library provides enhanced support for bulk operations.  The the native `couchbase` module only provides batch operation support for key lookups (via [`Bucket.prototype.getMulti()`](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#getMulti)).  The `couchbase-promises` module provides a extra methods on the `Bucket` class for performing batch operations.  See the [API](#api) documentation for more information.

The current version supports Couchbase Node.js SDK version 2.3.0.

## Usage
Usage is almost exactly the same as the native SDK, but with the added ability to use Promises instead of callbacks.

A user repository module with a simple lookup...

```js
const couchbase = require('couchbase-promises');
const cluster = new couchbase.Cluster('couchbase://127.0.0.1');
const bucket = cluster.openBucket();

function UserNotFoundError() {
  Error.call(this);
  Error.captureStackTrace(this, UserNotFoundError);
  this.message = "User not found.";
}
UserNotFoundError.prototype = Object.create(Error.prototype);
UserNotFoundError.prototype.constructor = UserNotFoundError;

exports = {
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
      })
      .catch(couchbase.Error, function(e) {
        if (e.code === couchbase.errors.keyNotFound)
          throw new UserNotFoundError();

        throw e;
      });
  }
};
```

## API

You use the `couchbase-promises` module much in the same way you use the native `couchbase` module.  The full documentation for the native module can be found at:

[http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/)

In addition to the added `*Async()` methods, the `couchbase-promises` module includes the following added pieces of functionality.

### Module: `couchbase`

  * `couchbase.Promise`: gets a reference to the constructor used to create `Promise` instances in `*Async()` methods.

  * `couchbase.setPromiseLib(lib)`: sets promise library used used by `*Async()` methods.  This method globally effects all `Cluster` and `Bucket` instances, and can be called at any time.

  * `couchbase.reverPromiseLib()`: reverts this promise library to the default ([bluebird](https://www.npmjs.com/package/bluebird)).  This method globally effects all `Cluster` and `Bucket` instances, and can be called at any time.

### Class: `Bucket`

  * `Bucket.prototype.appendMultiAsync(docs, options)`:
    Appends a value for each given key.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `docs`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `fragment`: _(required)_ the value to append.

        - `options`: _(optional)_ object that contains the [options used for append](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#append).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.counterMultiAsync(docs [, defaultOptions])`:
    Increments counter entries for each key.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `docs`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `delta`: _(required)_ the value to append.

        - `options`: _(optional)_ object that contains the [options used for counter](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#counter).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.getAndLockMultiAsync(keys [, defaultOptions])`:
    Gets the document for each key, and adds an exclusive lock for each entry.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ an array or `Set` of keys you wish to get and lock.

        Alternatively `keys` can be a `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

          - `options`: _(optional)_ object that contains the [options used for getAndLock](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#getAndLock).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.getAndTouchMultiAsync(docs [, defaultOptions])`:
    Gets the document for each key, sets their TTL value.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `docs`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `expiry`: _(required)_ the TTL duration in seconds.

        - `options`: _(optional)_ object that contains the [options used for getAndTouch](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#getAndTouch).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.getMultiAsync(keys [, options])`:
    Gets multiple documents given an array of keys.  The `getMulti()` method is the only batch operation supported by the native `couchbase` module.

    Returns a `Promise`.  This `Promise` will only reject in the event of a catastrophic failure.  Errors for individual keys will not result in a rejection.  The `Promise` will resolve with an object that looks similar to the `Summary` object, and contains the following keys:

      + `hasErrors`: a `Boolean` value indicating whether or not key failed.

      + `errors`: an integer representing the number of failed keys.

      + `results`: the raw results object from the native `getMulti()` method.

    Parameters include:

      + `keys`: _(required)_ an array of strings to lookup.

      + `options`: _(optional)_ an object with the following keys:

        - `batch_size`: _(optional)_ a number that indicates the size of each batch that is used to fetch the specified keys. A batch size of `0` indicates to perform all operations simultaneously.  The default is `0`.

  * `Bucket.prototype.getReplicaMultiAsync(keys [, defaultOptions])`:
    Gets documents for the specified keys from replica nodes.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ an array or `Set` of keys you wish to get and lock.

        Alternatively `keys` can be a `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

          - `options`: _(optional)_ object that contains the [options used for getReplica](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#getReplica).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.insertMultiAsync(docs [, defaultOptions])`:
    Inserts multiple documents into the bucket.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `docs`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `value`: _(required)_ the value of the document.

        - `options`: _(optional)_ object that contains the [options used for insert](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#insert).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.listAppendMultiAsync(keys [, defaultOptions])`:
    Appends an item to each list entry.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `value`: _(required)_ the value to append.

        - `options`: _(optional)_ object that contains the [options used for listAppend](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#listAppend).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.listGetMultiAsync(keys [, defaultOptions])`:
    Gets multiple list entries.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `index`: _(required)_ the index of the item in the list to retrieve.

        - `options`: _(optional)_ object that contains the [options used for listGet](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#listGet).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.listPrependMultiAsync(keys [, defaultOptions])`:
    Prepends an item to each list.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `value`: _(required)_ the value to prepend.

        - `options`: _(optional)_ object that contains the [options used for listPrepend](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#listPrepend).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.listRemoveMultiAsync(keys [, defaultOptions])`:
    Removes an item from each list.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `index`: _(required)_ the index of the item to remove from the list.

        - `options`: _(optional)_ object that contains the [options used for listRemove](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#listRemove).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.listSetMultiAsync(keys [, defaultOptions])`:
    Sets an item at a specific index for each list.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `index`: _(required)_ the index of the list entry you are setting.

        - `value`: _(required)_ the value to set in the list.

        - `options`: _(optional)_ object that contains the [options used for listSet](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#listSet).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.listSizeMultiAsync(keys [, defaultOptions])`:
    Gets the size of each list.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ an array or `Set` of keys for lists to which you want to get the size.

        Alternatively `keys` can be a `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `options`: _(optional)_ object that contains the [options used for listSize](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#listSize).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.mapAddMultiAsync(keys [, defaultOptions])`:
    Adds an entry to each map.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `path`: _(required)_ the key within the map.

        - `value`: _(required)_ the value to store in the map.

        - `options`: _(optional)_ object that contains the [options used for mapAdd](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#mapAdd).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.mapGetMultiAsync(keys [, defaultOptions])`:
    Gets a value from each map given a path.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `path`: _(required)_ the key within the map you wish to fetch.

        - `options`: _(optional)_ object that contains the [options used for mapGet](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#mapGet).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.mapRemoveMultiAsync(keys [, defaultOptions])`:
    Removes an item given a path for each map.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `path`: _(required)_ the key within the map you wish to remove.

        - `options`: _(optional)_ object that contains the [options used for mapRemove](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#mapRemove).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.mapSizeMultiAsync(keys [, defaultOptions])`:
    Gets the size of each map.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ an array or `Set` of keys for maps to which you want to get the size.

        Alternatively `keys` can be a `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `options`: _(optional)_ object that contains the [options used for mapSize](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#mapSize).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.prependMultiAsync(keys [, defaultOptions])`:
    Prepends a value to each document.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `fragment`: _(required)_ the value to prepend.

        - `options`: _(optional)_ object that contains the [options used for prepend](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#prepend).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.queuePopMultiAsync(keys [, defaultOptions])`:
    Pops the next item off of each queue.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ an array or `Set` of keys for queues to which you want to get the size.

        Alternatively `keys` can be a `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `options`: _(optional)_ object that contains the [options used for queuePop](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#queuePop).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.queuePushMultiAsync(keys [, defaultOptions])`:
    Pushes an item to the end of each queue.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `value`: _(required)_ the value to push to the queue.

        - `options`: _(optional)_ object that contains the [options used for queuePush](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#queuePush).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.queueSizeMultiAsync(keys [, defaultOptions])`:
    Gets the size of each queue.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ an array or `Set` of keys for queues to which you want to get the size.

        Alternatively `keys` can be a `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `options`: _(optional)_ object that contains the [options used for queueSize](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#queueSize).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.removeMultiAsync(keys [, defaultOptions])`:
    Removes multiple documents in the bucket.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`:  _(required)_ an array or `Set` of keys you wish to remove.

        Alternatively `keys` can be a `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `options`: _(optional)_ object that contains the [options used for remove](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#remove).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.replaceMultiAsync(docs [, defaultOptions])`:
    Replaces multiple documents in the bucket.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `docs`:  _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase you wish to replace.  Each value is an object with the following keys:

        - `value`: _(required)_ the replacement value.

        - `options`: _(optional)_ object that contains the [options used for replace](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#replace).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.setAddMultiAsync(keys [, defaultOptions])`:
    Adds an item to each set.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `value`: _(required)_ the value to add o the set.

        - `options`: _(optional)_ object that contains the [options used for setAdd](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#setAdd).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.setExistsMultiAsync(keys [, defaultOptions])`:
    Determines whether or not an item exists in each set.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `value`: _(required)_ the value to which you are validating the existence.

        - `options`: _(optional)_ object that contains the [options used for setExists](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#setExists).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.setRemoveMultiAsync(keys [, defaultOptions]s)`:
    Removes an item from each set.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `value`: _(required)_ the value you wish to remove from the set.

        - `options`: _(optional)_ object that contains the [options used for setRemove](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#setRemove).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.setSizeMultiAsync(keys [, defaultOptions])`:
    Gets the size of each set.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ an array or `Set` of keys for sets to which you want to get the size.

        Alternatively `keys` can be a `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `options`: _(optional)_ object that contains the [options used for setSize](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#setSize).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.touchMultiAsync(keys [, defaultOptions])`:
    Sets the TTL expiration for each document.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `expiry`: _(required)_ the TTL duration in seconds.

        - `options`: _(optional)_ object that contains the [options used for touch](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#touch).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.unlockMultiAsync(keys [, defaultOptions])`:
    Unlocks each document if the provided corresponding CAS values match the current.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `keys`: _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase.  Each value is an object with the following keys:

        - `cas`: _(required)_ the CAS value that was returned when the value was locked.

        - `options`: _(optional)_ object that contains the [options used for unlock](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#unlock).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

  * `Bucket.prototype.upsertMultiAsync(docs [, defaultOptions])`:
    Upserts multiple documents to the bucket. This method will create individual upsert operations for each key using `Promisea.all()`.

    Returns a `Promise` that resolves with a [`Summary`](#summary) object.  This `Promise` will always be fulfilled.  Any errors that occur will be specified in the resolved `Summary`.

    Parameters include:

      + `docs`:  _(required)_ object or `Map` where each key corresponds to the key used to store the document in Couchbase you wish to upsert.  Each value is an object with the following keys:

        - `value`: _(required)_ the contents of the document to be upserted.

        - `options`: _(optional)_ object that contains the [options used for upsert](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.2.5/Bucket.html#upsert).  If this key is absent, options provided by `defaultOptions` will be used.  If you provide this key as part of a `docs` entry, but set it to `undefined` or `null` no options will be used on the insert, and regardless of whether or not `defaultOptions` was provided.

      + `defaultOptions`: _(optional)_ default options for each operation.

### Class: `Summary`

Contains a summary of a bulk operation.  Keys include:

  * `hasErrors`: a Boolean value indicating whether or not any items failed in the bulk operation.
  * `keys`: an array of keys that were used in the bulk operations.
  * `results`: an object with properties for key used in the bulk operation.
    + `success`: a Boolean value indicating whether or not the the individual operation succeeded.
    + `err`: the error returned from Couchbase if the operation was not successful.
    + `result`: the result object returned from Couchbase.

### Multi-operations

All added multi-operations are executed with `Promise.all()`.  Thus, multiple individual requests to the Couchbase server made in parallel, as opposed to multiple operations being performed in a single request.

### Promises

By default, `Promise` instances are created using the [Bluebird](http://bluebirdjs.com/docs/getting-started.html) promises library.  We prefer it over native promises and some other libraries as it [offers a considerable performance advantage](https://github.com/petkaantonov/bluebird/tree/master/benchmark).  In addition to Bluebird, the `couchbase-promises` module has been tested with:

  * [ECMAScript `Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  * [`kew`](https://www.npmjs.com/package/kew)
  * [`q`](https://www.npmjs.com/package/q)
  * [`rsvp`](https://www.npmjs.com/package/rsvp)
