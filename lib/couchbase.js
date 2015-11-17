'use strict';

var couchbase = require('couchbase');

module.exports = {
  Cluster: require('./cluster'),
  SpatialQuery: couchbase.SpatialQuery,
  ViewQuery: couchbase.ViewQuery,
  N1qlQuery: couchbase.N1qlQuery,
  Mock: {
    Cluster: require('./mock-cluster'),
    SpatialQuery: couchbase.SpatialQuery,
    ViewQuery: couchbase.ViewQuery,
    N1qlQuery: couchbase.N1qlQuery,
    Mock: this,
    Error: couchbase.Error,
    errors: couchbase.errors
  },
  Error: couchbase.Error,
  errors: couchbase.errors
};
