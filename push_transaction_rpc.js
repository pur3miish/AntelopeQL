'use strict'

const { GraphQLError } = require('graphql')

/**
 * Pushes a serialised transaction to the blockchain.
 * @param {object} root Argument
 * @param {string} root.transaction_header Serialized transaction header.
 * @param {string} root.transaction_body Serialized transaction body.
 * @param {Array<string>} root.signatures List of signatures to validate transaction.
 * @param {SmartQLRPC} smartql_rpc see smartql_rpc.
 */
async function push_transaction_rpc(
  { transaction_header, transaction_body, signatures },
  smartql_rpc
) {
  const { fetch, rpc_url } = smartql_rpc
  const pushed_txn_req = await fetch(`${rpc_url}/v1/chain/push_transaction`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      signatures,
      compression: 0,
      packed_context_free_data: '',
      packed_trx: transaction_header + transaction_body
    })
  })
  const pushed_transaction = await pushed_txn_req.json()
  if (pushed_transaction.error)
    throw new GraphQLError(pushed_transaction.message, {
      extensions: pushed_transaction.error
    })

  return pushed_transaction
}

module.exports = push_transaction_rpc
