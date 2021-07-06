'use strict'

const rpc_call = require('./rpc_call')

/**
 * Returns an object containing various details about a specific block on the blockchain.
 * @param {object} arg Argument.
 * @param {Array<string>} arg.rpc_urls List of URL strings.
 * @param {string} arg.block_num_or_id Provide a block number or a block id.
 * @returns {object} Get block object.
 */
async function get_block({ block_num_or_id, rpc_urls }) {
  const info = await rpc_call(
    rpc_urls.map(url => `${url}/v1/chain/get_block`),
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        block_num_or_id,
        json: true
      })
    }
  )
  return info
}

module.exports = get_block
