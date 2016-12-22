# Change Log

## 3.0

### 3.0.0

  * __Breaking Changes__
    + The `Bucket.prototype.insertMultiAsync()` and `Bucket.prototype.removeMultiAsync()` methods now have different contracts, and support different `options` for each entry.

    + Removing deprecated methods `MutateInBuilder.prototype.addUnique()`, `MutateInBuilder.prototype.pushBack()`, and `MutateInBuilder.prototype.pushFront()`.

  * __New Features__
    + Adding ability to specify `Promise` library.
      - Adding read-only property `couchbase.Promise`.
      - Adding method `couchbase.setPromiseLib()`.
    + Adding support for `Bucket` as an `EventEmitter`.
      - Adding method `Bucket.prototype.addListener()`.
      - Adding method `Bucket.prototype.emit()`.
      - Adding method `Bucket.prototype.eventNames()`.
      - Adding method `Bucket.prototype.getMaxListeners()`.
      - Adding method `Bucket.prototype.listenerCount()`.
      - Adding method `Bucket.prototype.listeners()`.
      - Adding method `Bucket.prototype.on()`.
      - Adding method `Bucket.prototype.once()`.
      - Adding method `Bucket.prototype.prependListener()`.
      - Adding method `Bucket.prototype.prependOnceListener()`.
      - Adding method `Bucket.prototype.removeAllListeners()`.
      - Adding method `Bucket.prototype.removeListener()`.
      - Adding method `Bucket.prototype.setMaxListeners()`.
    + Adding new methods to `Bucket` to support new data structures list, map, queue, and set.
      - Adding method `Bucket.prototype.listAppend()`.
      - Adding method `Bucket.prototype.listAppendAsync()`.
      - Adding method `Bucket.prototype.listGet()`.
      - Adding method `Bucket.prototype.listGetAsync()`.
      - Adding method `Bucket.prototype.listPrepend()`.
      - Adding method `Bucket.prototype.listPrependAsync()`.
      - Adding method `Bucket.prototype.listRemove()`.
      - Adding method `Bucket.prototype.listRemoveAsync()`.
      - Adding method `Bucket.prototype.listSet()`.
      - Adding method `Bucket.prototype.listSetAsync()`.
      - Adding method `Bucket.prototype.listSize()`.
      - Adding method `Bucket.prototype.listSizeAsync()`.
      - Adding method `Bucket.prototype.mapAdd()`.
      - Adding method `Bucket.prototype.mapAddAsync()`.
      - Adding method `Bucket.prototype.mapGet()`.
      - Adding method `Bucket.prototype.mapGetAsync()`.
      - Adding method `Bucket.prototype.mapRemove()`.
      - Adding method `Bucket.prototype.mapRemoveAsync()`.
      - Adding method `Bucket.prototype.mapSize()`.
      - Adding method `Bucket.prototype.mapSizeAsync()`.
      - Adding method `Bucket.prototype.queuePop()`.
      - Adding method `Bucket.prototype.queuePopAsync()`.
      - Adding method `Bucket.prototype.queuePush()`.
      - Adding method `Bucket.prototype.queuePushAsync()`.
      - Adding method `Bucket.prototype.queueSize()`.
      - Adding method `Bucket.prototype.queueSizeAsync()`.
      - Adding method `Bucket.prototype.setAdd()`.
      - Adding method `Bucket.prototype.setAddAsync()`.
      - Adding method `Bucket.prototype.setExists()`.
      - Adding method `Bucket.prototype.setExistsAsync()`.
      - Adding method `Bucket.prototype.setRemove()`.
      - Adding method `Bucket.prototype.setRemoveAsync()`.
      - Adding method `Bucket.prototype.setSize()`.
      - Adding method `Bucket.prototype.setSizeAsync()`.
    + Enhancing support for multi-operations:
      - Adding method `Bucket.prototype.appendMultiAsync()`.
      - Adding method `Bucket.prototype.counterMultiAsync()`.
      - Adding method `Bucket.prototype.getAndLockMultiAsync()`.
      - Adding method `Bucket.prototype.getAndTouchMultiAsync()`.
      - Adding method `Bucket.prototype.getReplicaMultiAsync()`.
      - Adding method `Bucket.prototype.listAppendMultiAsync()`.
      - Adding method `Bucket.prototype.listGetMultiAsync()`.
      - Adding method `Bucket.prototype.listPrependMultiAsync()`.
      - Adding method `Bucket.prototype.listRemoveMultiAsync()`.
      - Adding method `Bucket.prototype.listSetMultiAsync()`.
      - Adding method `Bucket.prototype.listSizeMultiAsync()`.
      - Adding method `Bucket.prototype.mapAddMultiAsync()`.
      - Adding method `Bucket.prototype.mapGetMultiAsync()`.
      - Adding method `Bucket.prototype.mapRemoveMultiAsync()`.
      - Adding method `Bucket.prototype.mapSizeMultiAsync()`.
      - Adding method `Bucket.prototype.prependMultiAsync()`.
      - Adding method `Bucket.prototype.queuePopMultiAsync()`.
      - Adding method `Bucket.prototype.queuePushMultiAsync()`.
      - Adding method `Bucket.prototype.queueSizeMultiAsync()`.
      - Adding method `Bucket.prototype.replaceMultiAsync()`.
      - Adding method `Bucket.prototype.setAddMultiAsync()`.
      - Adding method `Bucket.prototype.setExistsMultiAsync()`.
      - Adding method `Bucket.prototype.setRemoveMultiAsync()`.
      - Adding method `Bucket.prototype.setSizeMultiAsync()`.
      - Adding method `Bucket.prototype.touchMultiAsync()`.
      - Adding method `Bucket.prototype.unlockMultiAsync()`.
      - Adding method `Bucket.prototype.upsertMultiAsync()`.
      - Adding method `Bucket.prototype.replaceMultiAsync()`.
      - Adding method `Bucket.prototype.touchMultiAsync()`.
      - Adding method `Bucket.prototype.upsertMultiAsync()`.
    + Exposing more of the base API:
      - Adding read-only property `couchbase.CbasQuery`.
      - Adding read-only property `couchbase.SearchFacet`.
      - Adding read-only property `couchbase.MutationState`.
      - Adding read-only property `couchbase.ClassicAuthenticator`.

  * __Technical Debt__
    + Updating `couchbase` to the latest version (2.2.5).

## 2.0

### 2.2.0

  * __New Features__
    + Adding support for SearchQuery (thanks to https://github.com/goatandsheep).

### 2.1.1

  * __Technical Debt__
    + Updating `couchbase` to the latest version (2.2.2).

### 2.1.0

* __Bug Fixes__
  + Fixing bug where `callback` parameter is not getting set correctly.

* __New Features__
  + Adding method `Bucket.prototype.insertMultiAsync()`.
  + Adding method `Bucket.prototype.removeMultiAsync()`.

* __Technical Debt__
  + Updating `couchbase` to the latest version (2.2.1).


### 2.0.0
  * __Bug Fixes__
    + Ensuring the proper `this` context is used when calling promisify.

  * __Technical Debt__
    + Switching to ES2015 syntax.
    + Updating `couchbase` to version 2.1.0.

## 1.0

### 1.0.1
  * __Bug Fixes__
    + Fixing a leak of the `arguments` object to avoid optimizing compiler bailouts.

### 1.0.0
  * Initial release.
