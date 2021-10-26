'use strict'

const { GraphQLObjectType, GraphQLString } = require('graphql')

const packed_transaction_type = new GraphQLObjectType({
  name: 'packed_transaction',
  description: 'Packed transaction, chain ID and transaction header',
  fields: () => ({
    chain_id: {
      type: GraphQLString,
      description: 'chain id'
    },
    transaction_header: {
      type: GraphQLString,
      description: 'Transaction header for TaPoS protection.'
    },
    transaction_body: {
      type: GraphQLString,
      description: 'Packed transaction.'
    }
  })
})
module.exports = packed_transaction_type
