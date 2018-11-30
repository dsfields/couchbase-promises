'use strict';

const couchbase = require('couchbase');

const Cluster = require('./cluster');
const MockCluster = require('./mock-cluster');
const promises = require('./promises');


const Mock = {
  Cluster: MockCluster,
  SpatialQuery: couchbase.Mock.SpatialQuery,
  ViewQuery: couchbase.Mock.ViewQuery,
  N1qlQuery: couchbase.Mock.N1qlQuery,
  Mock: null,
  Error: couchbase.Mock.Error,
  errors: couchbase.Mock.errors,
};


Mock.Mock = Mock;


class Couchbase {

  static get Cluster() { return Cluster; }
  static get BucketImpl() { return couchbase.BucketImpl; }
  static get SpatialQuery() { return couchbase.SpatialQuery; }
  static get ViewQuery() { return couchbase.ViewQuery; }
  static get N1qlQuery() { return couchbase.N1qlQuery; }
  static get CbasQuery() { return couchbase.CbasQuery; }
  static get SearchQuery() { return couchbase.SearchQuery; }
  static get SearchFacet() { return couchbase.SearchFacet; }
  static get SearchSort() { return couchbase.SearchSort; }
  static get MutationState() { return couchbase.MutationState; }
  static get Mock() { return Mock; }
  static get Error() { return couchbase.Error; }
  static get errors() { return couchbase.errors; }
  static get ServiceType() { return couchbase.ServiceType; }
  static get ClassicAuthenticator() { return couchbase.ClassicAuthenticator; }
  static get PasswordAuthenticator() { return couchbase.PasswordAuthenticator; }

  static get Promise() { return promises.Promise; }
  static setPromiseLib(lib) { promises.set(lib); }
  static revertPromiseLib() { promises.revert(); }

}

module.exports = Couchbase;
