'use strict'

const {
  GraphQLError,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString
} = require('graphql')
const fetch = require('isomorphic-fetch')

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
    const req = await fetch(rpc_url + '/v1/chain/get_currency_balance', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...args, json: true })
    })

    const data = await req.json()

    if (data.error && data.error.details)
      throw new GraphQLError(JSON.stringify(data.error))

    return data
  }
}

module.exports = currency_balance
