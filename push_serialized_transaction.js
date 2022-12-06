'use strict'

const { GraphQLNonNull } = require('graphql')
const bytes_type = require('./eosio_types/bytes_type.js')
const signature_type = require('./eosio_types/signature_type.js')
const transaction_receipt = require('./graphql_object_types/transaction_receipt.js')
const push_transaction_rpc = require('./push_transaction_rpc.js')

/**
 * Push transaction type.
 */
const push_serialized_transaction = {
  description: 'Pushes a serialized transaction to the blockchain.',
  type: new GraphQLNonNull(transaction_receipt),
  args: {
    transaction_header: { type: new GraphQLNonNull(bytes_type) },
    transaction_body: { type: new GraphQLNonNull(bytes_type) },
    signaures: { type: new GraphQLNonNull(signature_type) }
  },
  resolve(_, args, ctx) {
    return push_transaction_rpc(args, ctx.smartql_rpc)
  }
}

module.exports = push_serialized_transaction
