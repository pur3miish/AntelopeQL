'use strict'
const rpc_call = require('./rpc_call')

/**
 * Retrieve a table by scope.
 * @kind function
 * @name get_table_by_scope
 * @param {object} args Arguments to pass to RPC request.
 * @param {string} rpc_url RPC URL to connect to.
 * @returns {object} Table returned from smart contract.
 * @ignore
 */
const get_table_by_scope = async (args, rpc_url) => {
  const res = await rpc_call(rpc_url + '/v1/chain/get_table_by_scope', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      ...args,
      json: true
    })
  })

  return res
}

module.exports = get_table_by_scope
