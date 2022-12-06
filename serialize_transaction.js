'use strict'
const { GraphQLNonNull } = require('graphql')
const configuration_type = require('./graphql_input_types/configuration.js')
const packed_transaction_type = require('./graphql_object_types/packed_transaction.js')
const mutation_resolver = require('./mutation_resolver.js')

const serialize_transaction = (actions, ast_list) => ({
  description: 'Serialise a list of actions into an atomic binary instruction.',
  type: new GraphQLNonNull(packed_transaction_type),
  args: {
    actions: {
      type: actions
    },
    configuration: {
      type: configuration_type
    }
  },
  resolve(_, args, { smartql_rpc }) {
    return mutation_resolver(args, smartql_rpc, ast_list)
  }
})

module.exports = serialize_transaction
