'use strict'

const { GraphQLObjectType } = require('graphql/type/definition.js')
const { GraphQLString } = require('graphql/type/scalars.js')

const packed_transaction_type = new GraphQLObjectType({
  name: 'packed_transaction',
  description: 'Packed transaction, chain ID and transaction header',
  fields: () => ({
    chain_id: {
      type: GraphQLString,
      description: 'Chain id'
    },
    transaction_header: {
      type: GraphQLString,
      description: 'Transaction header for TaPos'
    },
    transaction_body: {
      type: GraphQLString,
      description: 'Packed transaction data'
    }
  })
})
module.exports = packed_transaction_type
