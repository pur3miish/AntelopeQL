'use strict'

const {
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLInt
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
const serialize_transaction_data = require('./serialize_transaction_data.js')

const defaultConfig = {
  blocksBehind: 3,
  expireSeconds: 30,
  max_net_usage_words: 0,
  max_cpu_usage_ms: 0,
  delay_sec: 0,
  context_free_actions: [],
  transaction_extensions: []
}

const configuration = new GraphQLInputObjectType({
  name: 'configuration',
  description: ``,
  fields: () => ({
    blocksBehind: {
      description: 'Number of blocks behind the current block',
      type: GraphQLInt,
      defaultValue: 3
    },
    expireSeconds: {
      description: 'Seconds past before transaction is no longer valid',
      type: GraphQLInt,
      defaultValue: 30
    },
    max_net_usage_words: {
      description: `Maximum NET bandwidth usage a transaction can consume, \nwhen set to 0 there is no limit`,
      type: GraphQLInt,
      defaultValue: 0
    },
    max_cpu_usage_ms: {
      description: `Maximum CPU bandwidth usage a transaction can consume, \nwhen set to 0 there is no limit`,
      type: GraphQLInt,
      defaultValue: 0
    },
    delay_sec: {
      type: GraphQLInt,
      description: 'Number of seconds that the transaciton will be delayed by',
      defaultValue: 0
    }
  })
}) //configuration

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

  return ABI.actions.reduce(
    (acc, { name, type, ricardian_contract }) => ({
      ...acc,
      [name]: {
        type: sign ? transaction_receipt_type : packed_transaction_type,
        description: (() => {
          let description = ricardian_contract.match(/^title: .+$/gmu)
          if (description) return description[0].replace('title: ', '')
          return ''
        })(),
        args: {
          ...(() => {
            if (ast_input_object_types[type])
              return {
                data: {
                  type: (() => ast_input_object_types[type])()
                }
              }
          })(),
          configuration: {
            description: 'Control elements of the EOSIO transaction.',
            type: configuration
          },
          authorization: {
            description: 'Authorization array object',
            type: new GraphQLNonNull(new GraphQLList(authorization_type))
          }
        },
        async resolve(
          _,
          {
            data,
            authorization,
            configuration: {
              blocksBehind,
              expireSeconds,
              max_net_usage_words,
              max_cpu_usage_ms,
              delay_sec,
              context_free_actions,
              transaction_extensions
            } = defaultConfig
          },
          { contract, rpc_urls }
        ) {
          const transaction_body =
            serialize_actions(context_free_actions) +
            serialize_actions([
              {
                account: contract,
                action: name,
                authorization,
                data: await serialize_transaction_data({
                  actionType: type,
                  data,
                  abi_ast
                })
              }
            ]) +
            serialize_extensions(transaction_extensions) +
            '0000000000000000000000000000000000000000000000000000000000000000'

          const { chain_id, head_block_num } = await get_info({ rpc_urls })

          const block_num_or_id = head_block_num - blocksBehind
          const { timestamp, block_num, ref_block_prefix } = await get_block({
            rpc_urls,
            block_num_or_id
          })

          const expiration =
            Math.round(Date.parse(timestamp + 'Z') / 1000) + expireSeconds

          // serialize transaction header
          const transaction_header = serialize_header({
            expiration,
            ref_block_num: block_num & 0xffff,
            ref_block_prefix,
            max_net_usage_words,
            max_cpu_usage_ms,
            delay_sec
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
    }),
    {}
  )
}

module.exports = build_mutation_fields
