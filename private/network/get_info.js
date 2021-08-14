'use strict'

const rpc_call = require('./rpc_call')

/**
 * Returns info regarding the EOSIO blockchain.
 * @param {object} arg Argument.
 * @param {string} arg.rpc_url RPC URL for cal.
 * @returns {object} Get info object.
 */
async function get_info({ rpc_url }) {
  const info = await rpc_call(`${rpc_url}/v1/chain/get_info`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json'
    }
  })
  return info
}

module.exports = get_info
