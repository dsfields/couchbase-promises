'use strict';

const couchbase = require('couchbase');

const Mock = {
  Cluster: require('./mock-cluster'),
  SpatialQuery: couchbase.Mock.SpatialQuery,
  ViewQuery: couchbase.Mock.ViewQuery,
  N1qlQuery: couchbase.Mock.N1qlQuery,
  Mock: null,
  Error: couchbase.Mock.Error,
  errors: couchbase.Mock.errors
};

Mock.Mock = Mock;

module.exports = {
  Cluster: require('./cluster'),
  N1qlQuery: couchbase.N1qlQuery,
  SpatialQuery: couchbase.SpatialQuery,
  ViewQuery: couchbase.ViewQuery,
  Mock: Mock,
  Error: couchbase.Error,
  errors: couchbase.errors
};
