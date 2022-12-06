'use strict'

const { GraphQLObjectType, GraphQLError } = require('graphql')
const deserialize_action_data = require('./deserialize_action_data.js')
const get_abi = require('./get_abi.js')
const get_account = require('./get_account.js')
const get_accounts_by_authorizers = require('./get_accounts_by_authorizers.js')
const get_block = require('./get_block.js')
const get_currency_balance = require('./get_currency_balance.js')
const get_currency_stats = require('./get_currency_stats.js')
const get_info = require('./get_info.js')

const blockchain_field = {
  description: `Retrieve infomation about the blockchain, cryptocurrency and accounts.`,
  type: new GraphQLObjectType({
    name: 'blockchain',
    fields: {
      get_account,
      get_abi,
      get_accounts_by_authorizers,
      get_block,
      get_currency_balance,
      get_currency_stats,
      get_info,
      deserialize_action_data
    }
  }),
  resolve(_, __, { smartql_rpc: { fetch, rpc_url } }) {
    if (!fetch)
      throw new GraphQLError('Fetch was not supplied to the `smartql_context`.')
    if (!rpc_url)
      throw new GraphQLError('No RPC url supplied to `smartql_context`.')
    return {}
  }
}

module.exports = blockchain_field
