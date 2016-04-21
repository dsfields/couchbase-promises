# Change Log

## 2.0

### 2.0.0
* Switching to ES2015 syntax.
* Updating Couchnode to latest version.
* The `couchbase` and `bluebird` modules are now `peerDependencies`.
* Bug fix: ensuring the proper `this` context is used when calling promisify.

## 1.0

### 1.0.1
* Bug fix: fixing a leak of the `arguments` object to avoid optimizing compiler bailouts.

### 1.0.0
* Initial release.
