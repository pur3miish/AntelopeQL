'use strict'

const { GraphQLError } = require('graphql/error/GraphQLError.js')
const get_required_keys = require('../network/get_required_keys.js')
const push_transaction = require('../network/push_transaction.js')
const resolver = require('./index.js')

/**
 * SmartQL Mutation resolver.
 * Serialize and push a mutation to the EOSIO blockchain
 * @kind function
 * @name broadcast_resolver
 * @param {object} arg Argument.
 * @param {object} arg.configuration Transaction configuration.
 * @param {object} arg.actions List of action data.
 * @param {string} arg.rpc_url URL of the nodeos EOSIO instance.
 * @param {Array} arg.context_free_actions context free actions.
 * @param {Array} arg.transaction_extensions transaction extensions.
 * @param {Array<string>} arg.private_keys  List of WIF private keys/
 * @param {object} abi_ast Application binary interface abstract syntax tree.
 * @returns {object} Transction EOSIO receipt.
 * @ignore
 */
async function broadcast_resolver(
  {
    configuration,
    actions,
    rpc_url,
    private_keys = [],
    context_free_actions = [],
    transaction_extensions = []
  },
  abi_ast
) {
  const { public_key_from_private, sign_txn } = require('eos-ecc')

  if (!private_keys.length) throw new GraphQLError('Expected private keys')
  // Remove any duplicate keys.
  private_keys = [...new Set(private_keys)]

  // Validate wif private keys and calc the corresponding public key(s).
  let key_chain = await Promise.all(
    [...private_keys].map(async pk => ({
      public_key: await public_key_from_private(pk),
      private_key: pk
    }))
  )

  const { chain_id, transaction_header, transaction_body, transaction } =
    await resolver(
      {
        configuration,
        actions,
        rpc_url,
        context_free_actions,
        transaction_extensions
      },
      abi_ast
    )

  const { required_keys, error } = await get_required_keys({
    rpc_url,
    transaction,
    available_keys: key_chain.map(({ public_key }) => public_key)
  })

  if (error) throw new GraphQLError(error)

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

  if (receipt.error) throw new GraphQLError(receipt.error)

  return receipt
}

module.exports = broadcast_resolver
