'use strict'
const { ok, throws } = require('assert')
const { validateSchema } = require('graphql')
const query_fields = require('../private/build_schema/build_query_fields/index.js')
const build_schema = require('../private/build_schema/index.js')
const base_abi = require('./abis/base_error.json')
const EOS_ABI = require('./abis/eosio.json')
const EOS_TOKEN_ABI = require('./abis/eosio.token.json')

module.exports = tests => {
  tests.add('build schema', async () => {
    // check if valid schema.
    ok(
      !validateSchema(build_schema(EOS_ABI, 'eosio')).length,
      'valid schema expected for eosio abi'
    )

    ok(
      !validateSchema(build_schema(EOS_TOKEN_ABI, 'eosio.token')).length,
      'valid schema expected for eosio.token abi'
    )

    ok(query_fields({}).noquery, 'no query')
    throws(() => build_schema(null))
    throws(() => build_schema(base_abi, 'base'))
  })
}
