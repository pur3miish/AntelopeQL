'use strict'

const { GraphQLList, GraphQLNonNull, GraphQLString } = require('graphql')
const transaction_receipt_type = require('../build_mutation_fields/types/transaction_receipt_type.js')
const push_txn = require('../network/push_transaction.js')

const push_transaction = {
  description: 'Push a serialized transaction to the blockchain.',
  type: transaction_receipt_type,
  args: {
    packed_trx: {
      description:
        'Serialized transaction is a hexadecimal string `transaction_header` + `transaction_body`.',
      type: new GraphQLNonNull(GraphQLString)
    },
    signatures: {
      description: 'List of signatures required to authorize transaction',
      type: new GraphQLList(new GraphQLNonNull(GraphQLString))
    }
  },
  async resolve(_, { packed_trx, signatures }, { rpc_url }) {
    return push_txn({
      transaction: packed_trx,
      signatures,
      rpc_url
    })
  }
}

module.exports = push_transaction
