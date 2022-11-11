'use strict'

const rpc_call = require('./rpc_call.js')

/**
 * Pushes a serialized transaction to the blockchain.
 * @param {object} arg Argument
 * @param {string} arg.transaction WASM transaction.
 * @param {Array<string>} arg.signatures List of signatures for the transaction.
 * @param {string} arg.rpc_url RPC url to push transaction.
 * @returns {objext} transaction receipt.
 */
const push_transaction = async ({ transaction, signatures, rpc_url }) => {
  const trx = await rpc_call(`${rpc_url}/v1/chain/push_transaction`, {
    body: JSON.stringify({
      signatures,
      compression: 0,
      packed_context_free_data: '',
      packed_trx: transaction,
      json: true
    })
  })

  return trx
}

module.exports = push_transaction
