'use strict'
const rpc_url = require('./rpc_call')

/**
 * Retrieve a table by scope.
 * @kind function
 * @name get_table_by_scope
 * @param {object} args Arguments to pass to RPC request.
 * @param {Array} rpc_urls List of RPC URLs to connect to.
 * @returns {object} Table returned from smart contract.
 * @ignore
 */
const get_table_by_scope = async (args, rpc_urls) => {
  const res = await rpc_url(
    rpc_urls.map(url => url + '/v1/chain/get_table_by_scope'),
    {
      method: 'POST',
      body: JSON.stringify({
        ...args,
        json: true
      })
    }
  )

  return res
}

module.exports = get_table_by_scope
