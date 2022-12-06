'use strict'

const { sign_packed_txn } = require('eos-ecc')
const { GraphQLNonNull } = require('graphql')
const configuration_type = require('./graphql_input_types/configuration.js')
const transaction_receipt = require('./graphql_object_types/transaction_receipt.js')
const mutation_resolver = require('./mutation_resolver.js')
const push_transaction_rpc = require('./push_transaction_rpc.js')

const push_transaction = (actions, ast_list) => ({
  description:
    'Serialize a list of actions and push them to the blockchain in one step, requires private keys to be supplied to smartql.',
  type: new GraphQLNonNull(transaction_receipt),
  args: {
    actions: {
      type: actions
    },
    configuration: {
      type: configuration_type
    }
  },
  async resolve(_, args, { smartql_rpc, private_keys }) {
    const { chain_id, transaction_header, transaction_body } =
      await mutation_resolver(args, smartql_rpc, ast_list)

    const signatures = await Promise.all(
      private_keys.map(wif_private_key =>
        sign_packed_txn({
          chain_id,
          transaction_body,
          transaction_header,
          wif_private_key
        })
      )
    )

    return push_transaction_rpc(
      { transaction_body, transaction_header, signatures },
      smartql_rpc
    )
  }
})

module.exports = push_transaction
