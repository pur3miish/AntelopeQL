'use strict'

const { GraphQLInputObjectType, GraphQLNonNull } = require('graphql')
const name_type = require('../../eosio_types/name_type')

const authorization_type = new GraphQLInputObjectType({
  name: 'authorization',
  description: 'Authorization object type.',
  fields: () => ({
    actor: {
      description: 'The name of the account name to sign the transaction.',
      type: new GraphQLNonNull(name_type)
    },
    permission: {
      description: 'The name of the account permission.',
      type: name_type,
      defaultValue: 'active'
    }
  })
})

module.exports = authorization_type
