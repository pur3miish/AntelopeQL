'use strict'

const { GraphQLList, GraphQLNonNull, GraphQLString } = require('graphql')
const get_currency_balance = require('../network/get_currency_balance.js')

const currency_balance = {
  description: 'Retrieve current balance.',
  type: new GraphQLList(GraphQLString),
  args: {
    code: {
      description: 'The account name that holds the currency tokens',
      type: GraphQLString,
      defaultValue: 'eosio.token'
    },
    account: {
      description: 'Account name to query the balance for.',
      type: new GraphQLNonNull(GraphQLString)
    },
    symbol: {
      description: 'The crytpo currency token symbol.',
      type: new GraphQLNonNull(GraphQLString),
      defaultValue: 'EOS'
    }
  },
  async resolve(_, args, { rpc_url }) {
    return get_currency_balance({ rpc_url, ...args })
  }
}

module.exports = currency_balance
