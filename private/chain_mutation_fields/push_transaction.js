'use strict'

const {
  GraphQLError,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString
} = require('graphql')
const fetch = require('isomorphic-fetch')
const transaction_receipt_type = require('../build_mutation_fields/types/transaction_receipt_type.js')

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
    const req = await fetch(rpc_url + '/v1/chain/push_transaction', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        signatures,
        compression: 0,
        packed_context_free_data: '',
        packed_trx,
        json: true
      })
    })

    const { error, ...data } = await req.json()
    if (error && error.details) throw new GraphQLError(JSON.stringify(error))

    return data
  }
}

module.exports = push_transaction
