'use strict'

const rpc_call = require('./rpc_call')

/**
 * Pushes a serialized transaction to the blockchain.
 * @param {object} arg Argument
 * @param {string} arg.transaction WASM transaction.
 * @param {Array<string>} arg.signatures List of signatures for the transaction.
 * @param {Array<string>} arg.rpc_urls List of RPC urls for the transaction.
 * @returns {objext} transaction receipt.
 */
const push_transaction = async ({ transaction, signatures, rpc_urls }) => {
  const trx = await rpc_call(
    rpc_urls.map(url => `${url}/v1/chain/push_transaction`),
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        signatures,
        compression: 0,
        packed_context_free_data: '',
        packed_trx: transaction,
        json: true
      })
    }
  )

  return trx
}

module.exports = push_transaction
