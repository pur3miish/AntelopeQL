'use strict'

const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = require('graphql')

const authorizing_account_type = new GraphQLObjectType({
  name: 'authorizing_account_type',
  fields: () => ({
    actor: {
      type: new GraphQLNonNull(GraphQLString)
    },
    permission: {
      type: GraphQLString
    }
  })
})

module.exports = authorizing_account_type
