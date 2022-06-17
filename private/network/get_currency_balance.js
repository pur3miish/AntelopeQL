'use strict'

const rpc_call = require('./rpc_call')

/**
 * Returns an object containing various details about a specific block on the blockchain.
 * @param {object} arg Argument.
 * @param {string} arg.code contract where currency exists.
 * @param {string} arg.account account to query
 * @param {string} arg.symbol currency symbol
 * @param {string} arg.rpc_url rpc url.
 * @returns {object} account balance.
 */
async function get_currency_balance({ code, account, symbol, rpc_url }) {
  const info = await rpc_call(`${rpc_url}/v1/chain/get_currency_balance`, {
    body: JSON.stringify({
      code,
      account,
      symbol,
      json: true
    })
  })
  return info
}

module.exports = get_currency_balance
