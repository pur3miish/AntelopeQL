'use strict'

const rpc_call = require('./rpc_call')

/**
 * Returns an object containing various details about a specific block on the blockchain.
 * @param {object} arg Argument.
 * @param {Array<string>} arg.keys list of keys.
 * @param {Array<stirng>} arg.accounts list of account names.
 * @param {Array<object>} arg.authorization Auth objects.
 * @param {string} arg.rpc_url URL to connect to.
 * @returns {object} Get block object.
 */
async function get_account_by_authorizers({
  rpc_url,
  keys,
  accounts,
  authorization
}) {
  const info = await rpc_call(
    `${rpc_url}/v1/chain/get_accounts_by_authorizers`,
    {
      body: JSON.stringify({
        keys,
        accounts: [...accounts, ...authorization],
        json: true
      })
    }
  )
  return info
}

module.exports = get_account_by_authorizers
