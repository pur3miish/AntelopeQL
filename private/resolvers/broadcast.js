'use strict'

const get_required_keys = require('../network/get_required_keys.js')
const push_transaction = require('../network/push_transaction.js')

/**
 * SmartQL Mutation resolver, serialize and push a mutation to the EOSIO blockchain
 * @kind function
 * @name broadcast_resolver
 * @param {object} arg Argument.
 * @param {string} arg.chain_id Checksum of the hash.
 * @param {string} arg.transaction_header Serialized transaction header.
 * @param {string} arg.transaction_body Serialized transaction body.
 * @param {object} arg.transaction Transaction object for the transaction.
 * @param {string} arg.rpc_url URL of the nodeos EOSIO instance.
 * @param {Array<string>} arg.private_keys  List of WIF private keys.
 * @returns {object} Transction `EOSIO` receipt.
 * @ignore
 */
async function broadcast_resolver({
  chain_id,
  transaction_header,
  transaction_body,
  transaction,
  rpc_url,
  private_keys = []
}) {
  const { public_key_from_private, sign_txn } = require('eos-ecc')

  if (!private_keys.length) throw new TypeError('Expected private keys')
  // Remove any duplicate keys.
  private_keys = [...new Set(private_keys)]

  // Validate wif private keys and calc the corresponding public key(s).
  let key_chain = await Promise.all(
    [...private_keys].map(async pk => ({
      public_key: await public_key_from_private(pk),
      private_key: pk
    }))
  )

  const { required_keys, error } = await get_required_keys({
    rpc_url,
    transaction,
    available_keys: key_chain.map(({ public_key }) => public_key)
  })

  if (error) throw new Error(JSON.stringify(error))

  // Generate sigs
  const signatures = await Promise.all(
    required_keys.map(key => {
      return sign_txn({
        hex: chain_id + transaction_header + transaction_body,
        wif_private_key: key_chain.find(({ public_key }) => key == public_key)
          .private_key
      })
    })
  )

  const receipt = await push_transaction({
    transaction: transaction_header + transaction_body,
    signatures,
    rpc_url
  })

  if (receipt.error) throw new Error(JSON.stringify(receipt.error))

  return receipt
}

module.exports = broadcast_resolver
