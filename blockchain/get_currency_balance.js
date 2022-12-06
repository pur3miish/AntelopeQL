'use strict'

const {
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLError
} = require('graphql')
const name_type = require('../eosio_types/name_type.js')
const symbol_code_type = require('../eosio_types/symbol_code_type.js')

const currency_balance = {
  description: 'Retrieve current balance.',
  type: new GraphQLList(GraphQLString),
  args: {
    code: {
      description: 'The account name that holds the currency tokens',
      type: name_type,
      defaultValue: 'eosio.token'
    },
    account: {
      description: 'Account name to query the balance for.',
      type: new GraphQLNonNull(name_type)
    },
    symbol: {
      description: 'The crytpo currency token symbol.',
      type: new GraphQLNonNull(symbol_code_type),
      defaultValue: 'EOS'
    }
  },
  async resolve(_, args, { smartql_rpc: { fetch, rpc_url } }) {
    const uri = `${rpc_url}/v1/chain/get_currency_balance`
    const req = await fetch(uri, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        ...args,
        json: true
      })
    })
    const data = await req.json()

    if (data.error) throw new GraphQLError(data.message, { extensions: data })

    return data
  }
}

module.exports = currency_balance
