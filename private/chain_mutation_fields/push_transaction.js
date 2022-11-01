'use strict'

const { GraphQLList, GraphQLNonNull } = require('graphql')
const transaction_receipt_type = require('../build_mutation_fields/types/transaction_receipt_type.js')
const bytes_type = require('../eosio_types/bytes_type')
const signature_type = require('../eosio_types/signature_type.js')
const push_txn = require('../network/push_transaction.js')

const push_transaction = {
  description: 'Push a serialized transaction to the blockchain.',
  type: transaction_receipt_type,
  args: {
    transaction_header: {
      description: 'Serialized transaction header (transaction meta data).',
      type: new GraphQLNonNull(bytes_type)
    },
    transaction_body: {
      description: 'Serialised transaction body (transaction instructions).',
      type: new GraphQLNonNull(bytes_type)
    },
    signatures: {
      description: 'List of signatures required to authorize transaction',
      type: new GraphQLList(new GraphQLNonNull(signature_type))
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
