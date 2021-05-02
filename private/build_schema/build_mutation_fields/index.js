'use strict'

const {
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull
} = require('graphql')
const authorization_type = require('../../eos_types/authorization_type')
const {
  transaction_receipt_type,
  packed_transaction_type
} = require('../../eos_types/mutation_types')
const get_block = require('../../network/get_block.js')
const get_info = require('../../network/get_info.js')
const push_transaction = require('../../network/push_transaction.js')
const serialize_actions = require('../../wasm/serialize/actions.js')
const serialize_extensions = require('../../wasm/serialize/extension.js')
const serialize_header = require('../../wasm/serialize/transaction_header.js')
const abi_to_ast = require('../abi_to_ast/index.js.js')
const { configuration, defaultValue } = require('./configuration')
const serialize_transaction_data = require('./serialize_transaction_data.js')

/**
 * This function builds mutation fields of a GraphQL query of the Schema from an ABI of a given EOS smart contract.
 * @name build_mutation_fields
 * @kind function
 * @param {object} ABI ABI for a smart contract.
 * @param {Function} [sign] Digiatal signature generation.
 * @returns {object} GraphQL mutation fields.
 * @ignore
 */
function build_mutation_fields(ABI, sign) {
  const { ast_input_object_types, abi_ast } = abi_to_ast(ABI)

  const fields = ABI.actions.reduce(
    (acc, { name, type, ricardian_contract }) => ({
      ...acc,
      [name]: {
        description: (() => {
          let description = ricardian_contract.match(/^title: .+$/gmu)
          if (description) return description[0].replace('title: ', '')
          return ''
        })(),
        type: new GraphQLInputObjectType({
          name: `${name}_data`,
          fields: () => ({
            ...(() => {
              if (Object.keys(ast_input_object_types[type]._fields()).length)
                return ast_input_object_types[type]._fields()
            })(),
            authorization: {
              description: 'Authorization array object.',
              type: new GraphQLNonNull(new GraphQLList(authorization_type))
            }
          })
        })
      }
    }),
    {}
  )

  return {
    transaction: {
      type: sign ? transaction_receipt_type : packed_transaction_type,
      description: '',
      args: {
        actions: {
          type: GraphQLNonNull(
            new GraphQLList(
              GraphQLNonNull(
                new GraphQLInputObjectType({
                  name: 'action_type',
                  description: 'List of the smart contract actions.',
                  fields
                })
              )
            )
          )
        },
        configuration: {
          type: configuration
        }
      },
      async resolve(
        _,
        { configuration = defaultValue, actions },
        { contract, rpc_urls }
      ) {
        const context_free_actions = []
        const transaction_extensions = []
        let action_array = []

        for await (const action of actions)
          action_array.push(
            ...(await Promise.all(
              Object.keys(action).map(async actionType => {
                const { authorization, ...data } = action[actionType]
                return {
                  account: contract,
                  action: actionType,
                  authorization,
                  data: await serialize_transaction_data({
                    actionType,
                    data,
                    abi_ast
                  })
                }
              })
            ))
          )

        const transaction_body =
          serialize_actions(context_free_actions) +
          serialize_actions(action_array) +
          serialize_extensions(transaction_extensions) +
          '0000000000000000000000000000000000000000000000000000000000000000'

        const { chain_id, head_block_num } = await get_info({ rpc_urls })
        const block_num_or_id = head_block_num - configuration.blocksBehind
        const { timestamp, block_num, ref_block_prefix } = await get_block({
          rpc_urls,
          block_num_or_id
        })
        const expiration =
          Math.round(Date.parse(timestamp + 'Z') / 1000) +
          configuration.expireSeconds

        const transaction_header = serialize_header({
          expiration,
          ref_block_num: block_num & 0xffff,
          ref_block_prefix,
          max_net_usage_words: configuration.max_net_usage_words,
          max_cpu_usage_ms: configuration.max_cpu_usage_ms,
          delay_sec: configuration.delay_sec
        })

        if (!sign) return { chain_id, transaction_body, transaction_header }

        const signatures = await sign({
          chain_id,
          transaction_body,
          transaction_header
        })

        if (!Array.isArray(signatures))
          throw new Error(
            'Expected “sign” function to return an array of signatures.'
          )

        const receipt = await push_transaction({
          transaction: transaction_header + transaction_body,
          signatures,
          rpc_urls
        })

        if (receipt.error)
          throw new Error(
            `${receipt.error.what} - ${receipt.error.details[0].message}`
          )

        return receipt
      }
    }
  }
}

module.exports = build_mutation_fields
