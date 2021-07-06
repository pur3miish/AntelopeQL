'use strict'

const rpc_call = require('./rpc_call')

/**
 * Returns info regarding the EOSIO blockchain.
 * @param {object} arg Argument.
 * @param {Array<string>} arg.rpc_urls List of URL strings.
 * @returns {object} Get info object.
 */
async function get_info({ rpc_urls }) {
  const info = await rpc_call(
    rpc_urls.map(url => `${url}/v1/chain/get_info`),
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      }
    }
  )
  return info
}

module.exports = get_info
