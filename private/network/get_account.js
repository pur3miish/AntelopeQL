'use strict'
const rpc_call = require('./rpc_call')

/**
 * EOS account name base32 - characters 1-5, a-z and dot.
 * @kind typedef
 * @name NAME
 * @prop {string} name EOS account name.
 * @ignore
 */

/**
 * Retrieves an ABI for a smart contract help at `contract`.
 * @name get_account
 * @kind function
 * @param {object} arg Argument.
 * @param {string} arg.rpc_url RPC URL.
 * @param {NAME} arg.account_name Name of the EOS account that holds the smart contract.
 * @returns {object} account object.
 * @ignore
 */
async function get_account({ account_name, rpc_url }) {
  const data = await rpc_call(`${rpc_url}/v1/chain/get_account`, {
    body: JSON.stringify({
      account_name,
      json: true
    })
  })

  return data
}

module.exports = get_account
