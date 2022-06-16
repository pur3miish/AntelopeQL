'use strict'

const rpc_call = require('./rpc_call')

/**
 * Returns an object containing various details about a specific block on the blockchain.
 * @param {object} arg Argument.
 * @param {string} arg.rpc_url string.
 * @param {string} arg.block_num_or_id Provide a block number or a block id.
 * @returns {object} Get block object.
 */
async function get_block({ block_num_or_id, rpc_url }) {
  const info = await rpc_call(`${rpc_url}/v1/chain/get_block`, {
    body: JSON.stringify({
      block_num_or_id,
      json: true
    })
  })
  return info
}

module.exports = get_block
