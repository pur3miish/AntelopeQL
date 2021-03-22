'use strict'

const { GraphQLInputObjectType } = require('graphql')
const name_type = require('./name')

const authorization_type = new GraphQLInputObjectType({
  name: 'authorization',
  description: 'Authorization object type.',
  fields: () => ({
    actor: {
      description: 'The name of the account name to sign the transaction.',
      type: name_type
    },
    permission: {
      description: 'The name of the account permission.',
      type: name_type,
      defaultValue: 'active'
    }
  })
})

module.exports = authorization_type
