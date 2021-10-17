'use strict'

const { GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql')

const bandwidth_cost_type = new GraphQLObjectType({
  name: 'bandwidth_cost',
  fields: () => ({
    cpu_usage_us: {
      type: GraphQLInt,
      resolve: ({ cpu_usage_us }) => cpu_usage_us
    },
    net_usage_words: {
      type: GraphQLInt,
      resolve: ({ net_usage_words }) => net_usage_words
    },
    status: {
      type: GraphQLString
    }
  })
})

module.exports = bandwidth_cost_type
