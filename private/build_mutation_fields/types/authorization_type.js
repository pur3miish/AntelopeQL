'use strict'

const { GraphQLInputObjectType, GraphQLNonNull } = require('graphql')
const name_type = require('../../eosio_types/name_type')

/**
 * The action authorization type for action validation.
 * @kind typedef
 * @name authorization
 * @type {object}
 * @prop {string} actor Name of the account that is trying to authorize.
 * @prop {string} permission Name of the `permission` of the the `actor`
 */

const authorization_type = new GraphQLNonNull(
  new GraphQLInputObjectType({
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
)

module.exports = authorization_type
