'use strict'

const {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLList
} = require('graphql')

const actions_type = fields =>
  new GraphQLNonNull(
    new GraphQLList(
      new GraphQLNonNull(
        new GraphQLInputObjectType({
          name: 'actions_type',
          fields
        })
      )
    )
  )

module.exports = actions_type
