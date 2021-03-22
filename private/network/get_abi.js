'use strict'
const rpc_call = require('./rpc_call')

/**
 * EOS account name base32 - characters 1-5, a-z and dot.
 * @kind typedef
 * @name NAME
 * @prop {string} name
 * @ignore
 */

/**
 * Retrieves an ABI for a smart contract help at `contract`.
 * @name get_abi
 * @kind function
 * @param {object} arg Argument.
 * @param {Array} arg.rpc_urls List of URLs running a
 * @param {NAME} arg.contract Name of the EOS account that holds the smart contract.
 * @returns {ABI} The contract abi.
 * @ignore
 */
async function get_abi({ contract, rpc_urls }) {
  if (!rpc_urls || !rpc_urls.length || !Array.isArray(rpc_urls))
    throw new TypeError(`Expected an array of URLs for rpc_urls argument.`)
  if (!contract)
    throw new TypeError(
      `Epected a contract to be string, got ${typeof contract}`
    )

  const { abi, error } = await rpc_call(
    rpc_urls.map(url => `${url}/v1/chain/get_abi`),
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        account_name: contract,
        json: true
      })
    }
  )

  if (abi) return abi
  if (error)
    if (
      error.details &&
      Array.isArray(error.details) &&
      error.details[0].message ==
        `unknown key (eosio::chain::name): ${contract}`
    )
      throw new Error(`“${contract}” is not an account on the EOS blockchain.`)
    else throw new Error('Internal server error.')
  else
    throw new Error(`No smart contract held by the EOS account “${contract}”.`)
}

module.exports = get_abi
