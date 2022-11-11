'use strict'

const { GraphQLObjectType } = require('graphql')
const chain_queries_fields = require('../../chain_queries_fields/index.js')

const blockchain_field = {
  description: `Retrieve various stats and data for the state of the blockchain (including account and currency info).`,
  type: new GraphQLObjectType({
    name: 'blockchain',
    fields: {
      ...chain_queries_fields
    }
  }),
  resolve() {
    return {}
  }
}

module.exports = blockchain_field
