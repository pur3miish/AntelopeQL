'use strict'
const rpc_call = require('./rpc_call.js')
/**
 * Returns list of block producers.
 * @param {object} arg Argument.
 * @param {string} arg.rpc_url RPC URL for cal.
 * @returns {object} Get info object.
 */
async function get_producers({ rpc_url, ...args }) {
  const producers = await rpc_call(`${rpc_url}/v1/chain/get_producers`, {
    body: JSON.stringify({ ...args, json: true })
  })

  return producers
}
module.exports = get_producers
