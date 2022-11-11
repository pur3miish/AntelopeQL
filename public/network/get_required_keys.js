'use strict'

const rpc_call = require('./rpc_call.js')

/**
 * Returns the required keys for a given transaction authorization.
 * @param {object} arg Argument.
 * @param {string} arg.transaction EOSIO transaction.
 * @param {string} arg.available_keys List of available public keys
 * @param {string} arg.rpc_url Endpoint to send transcations to.
 * @returns {Array<strings>} List of public keys required for authorizing transactions..
 */
async function get_required_keys({ rpc_url, transaction, available_keys }) {
  const info = await rpc_call(`${rpc_url}/v1/chain/get_required_keys`, {
    body: JSON.stringify({
      transaction,
      available_keys,
      json: true
    })
  })

  return info
}

module.exports = get_required_keys
