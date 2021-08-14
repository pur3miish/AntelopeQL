'use strict'

const rpc_call = require('./rpc_call')

/**
 * Finds a list of account authorities with the public keys provided.
 * @param {object} args Argument.
 * @param {string} args.rpc_url The array of urls.
 * @param {Array<string>} args.keys List of public_keys.
 * @returns {object} Account Authority with this public keys.
 */
async function get_account_by_authorizers({ rpc_url, keys }) {
  const info = await rpc_call(
    `${rpc_url}/v1/chain/get_accounts_by_authorizers`,
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        keys
      })
    }
  )
  return info
}

module.exports = get_account_by_authorizers
