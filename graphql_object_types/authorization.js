'use strict'
const { GraphQLObjectType, GraphQLString } = require('graphql')

const authorization_type = new GraphQLObjectType({
  name: 'authorization_type',
  fields: () => ({
    actor: {
      type: GraphQLString
    },
    permission: {
      type: GraphQLString
    }
  })
})

module.exports = authorization_type
