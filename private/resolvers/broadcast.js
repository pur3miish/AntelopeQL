'use strict'

const push_transaction = require('../network/push_transaction.js')

/**
 * SmartQL Mutation resolver, serialize and push a mutation to the EOSIO blockchain
 * @kind function
 * @name broadcast_resolver
 * @param {object} arg Argument.
 * @param {string} arg.transaction_header Serialized transaction header.
 * @param {string} arg.transaction_body Serialized transaction body.
 * @param {string} arg.rpc_url URL of the nodeos EOSIO instance.
 * @param {Array<string>} arg.signatures  List of signatures to satisfy authorization.
 * @returns {object} Transction `EOSIO` receipt.
 * @ignore
 */
async function broadcast_resolver({
  transaction_header,
  transaction_body,
  rpc_url,
  signatures
}) {
  const receipt = await push_transaction({
    transaction: transaction_header + transaction_body,
    signatures,
    rpc_url
  })

  if (receipt.error) throw new Error(JSON.stringify(receipt.error))

  return receipt
}

module.exports = broadcast_resolver
