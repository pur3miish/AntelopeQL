'use strict'

const build_mutation_fields = require('../private/build_schema/build_mutation_fields')
const build_query_fields = require('../private/build_schema/build_query_fields')
const get_abi = require('../private/network/get_abi')

/**
 * Build GraphQL fields (mutation and query) for a smart contract.
 * @kind function
 * @name build_fields
 * @param {object} arg Argument.
 * @param {string} arg.rpc_url Endpoint url.
 * @param {string} arg.contract Account name that holds the smart contract.
 * @param {bool} arg.broadcast Determins if the schema mutation will include a receipt type or a packed transaction type.
 * @returns {object} GraphQL fields for a given smart contract.
 */
async function build_fields({ rpc_url, contract, broadcast }) {
  const abi = await get_abi({ rpc_url, contract })

  return {
    queries: await build_query_fields(abi, contract),
    mutations: await build_mutation_fields(abi, contract, broadcast)
  }
}

module.exports = build_fields
