'use strict'

const { ok } = require('assert')
const { validateSchema } = require('graphql')
const build_schema = require('../private/build_schema/index.js')
const EOS_ABI = require('./abis/eosio.json')
const EOS_TOKEN_ABI = require('./abis/eosio.token.json')

module.exports = tests => {
  tests.add('build schema', async () => {
    const schema_eosio_token = build_schema(EOS_TOKEN_ABI, 'eosio_token', false)
    const schema_eosio = build_schema(EOS_ABI, 'eosio', true)
    ok(
      validateSchema(schema_eosio_token).length == 0,
      'Schema eosio.token passed validation.'
    )
    ok(
      validateSchema(schema_eosio).length == 0,
      'Schema eosio passed validation.'
    )
  })
}
