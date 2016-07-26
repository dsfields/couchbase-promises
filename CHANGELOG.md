# Change Log

## 2.0

### 2.1.0
  * Updating Couchnode to the latest version 2.2.1.
  * Adding additional methods `Bucket.prototype.insertMultiAsync` and `Bucket.prototype.removeMultiAsync`.
  * Fixing bug where `callback` parameter is not getting set correctly.

### 2.0.0
  * Switching to ES2015 syntax.
  * Updating Couchnode to version 2.1.0.
  * The `couchbase` and `bluebird` modules are now `peerDependencies`.
  * Bug fix: ensuring the proper `this` context is used when calling promisify.

## 1.0

### 1.0.1
  * Bug fix: fixing a leak of the `arguments` object to avoid optimizing compiler bailouts.

### 1.0.0
  * Initial release.
