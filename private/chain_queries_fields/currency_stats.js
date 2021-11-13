'use strict'
const {
  GraphQLError,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} = require('graphql')
const fetch = require('isomorphic-fetch')

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
    const req = await fetch(rpc_url + '/v1/chain/get_currency_stats', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...args, json: true })
    })

    const { error, ...data } = await req.json()
    if (error && error.details) throw new GraphQLError(JSON.stringify(error))

    return Object.values(data)[0]
  }
}

module.exports = currency_stats
