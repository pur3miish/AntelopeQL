'use strict'
const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLError
} = require('graphql')
const name_type = require('../eosio_types/name_type.js')
const symbol_code_type = require('../eosio_types/symbol_code_type.js')

const currency_stats_type = new GraphQLObjectType({
  name: 'currency_stats_type',
  fields: () => ({
    supply: {
      type: GraphQLString
    },
    max_supply: {
      type: GraphQLString
    },
    issuer: {
      type: name_type
    }
  })
})

const get_currency_stats = {
  description: 'Retrieve currency stats.',
  type: currency_stats_type,
  args: {
    code: {
      type: new GraphQLNonNull(name_type)
    },
    symbol: {
      type: new GraphQLNonNull(symbol_code_type)
    }
  },
  async resolve(_, { symbol, ...args }, { smartql_rpc: { fetch, rpc_url } }) {
    const uri = `${rpc_url}/v1/chain/get_currency_stats`
    const req = await fetch(uri, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        symbol,
        json: true,
        ...args
      })
    })
    const data = await req.json()

    if (data.error) throw new GraphQLError(data.message, { extensions: data })

    return data[symbol]
  }
}

module.exports = get_currency_stats
