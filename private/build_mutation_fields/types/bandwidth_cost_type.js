'use strict'

const { GraphQLObjectType } = require('graphql/type/definition.js')
const { GraphQLInt, GraphQLString } = require('graphql/type/scalars.js')

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
