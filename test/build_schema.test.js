'use strict'
const { ok } = require('assert')
const { validateSchema } = require('graphql')
const build_schema = require('../private/build_schema/index.js')
const EOS_ABI = require('./abis/eosio.json')
const EOS_TOKEN_ABI = require('./abis/eosio.token.json')

module.exports = tests => {
  tests.add('schema snapshot - eosio.token', async () => {
    // check if valid schema.
    ok(
      !validateSchema(build_schema(EOS_ABI, 'eosio')).length,
      'valid schema expected for eosio abi'
    )

    ok(
      !validateSchema(build_schema(EOS_TOKEN_ABI, 'eosio.token')).length,
      'valid schema expected for eosio.token abi'
    )
  })
}
