'use strict'
const rpc_call = require('./rpc_call')

/**
 * Retrieves a table for the smart contract by row.
 * @name get_table_by_row
 * @kind function
 * @param {object} args Fetch arguments.
 * @param {Array} rpc_urls List of RPC URLs.
 * @returns {object} Responce from the table.
 * @ignore
 */
const get_table_by_row = async (args, rpc_urls) => {
  const res = await rpc_call(
    rpc_urls.map(url => url + '/v1/chain/get_table_rows'),
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        ...args,
        json: true
      })
    }
  )

  return res
}

module.exports = get_table_by_row
