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
 * @name get_abi
 * @kind function
 * @param {object} arg Argument.
 * @param {string} arg.rpc_url RPC URL.
 * @param {NAME} arg.contract Name of the EOS account that holds the smart contract.
 * @returns {ABI} The contract abi.
 * @ignore
 */
async function get_abi({ contract, rpc_url }) {
  return rpc_call(`${rpc_url}/v1/chain/get_abi`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      account_name: contract.replace(/^[.]{1}/gmu, ''),
      json: true
    })
  })
}

module.exports = get_abi
