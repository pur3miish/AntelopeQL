'use strict'
const { GraphQLNonNull, GraphQLObjectType, GraphQLString } = require('graphql')
const get_currency_stats = require('../network/get_currency_stats')

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
      type: GraphQLString
    }
  })
})

const currency_stats = {
  description: 'Retrieve currency stats.',
  type: currency_stats_type,
  args: {
    code: {
      type: new GraphQLNonNull(GraphQLString)
    },
    symbol: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(_, args, { rpc_url }) {
    const currency = await get_currency_stats({ rpc_url, ...args })

    return currency[args.symbol]
  }
}

module.exports = currency_stats
