'use strict'
const {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')
const resolver = require('../resolvers/index.js')
const serialize_transaction_data = require('../serialize/transaction_data.js')
const configuration_default_value = require('./types/configuration_default_value.js')
const configuration_type = require('./types/configuration_type.js')
const packed_transaction_type = require('./types/packed_transaction_type.js')

/**
 * Generate mutation fields that can handle atomic transactions accross multiple smart contracts (1 -> x).
 * @kind function
 * @name build_transactions_mutation_fields
 * @param {object} serialize_transaction_fields List of smart contract mutation fields
 * @param {Array<object>} abi_ast List of abstract syntax tree (AST) of the corresponding application binary interface‘s (ABI).
 * @returns {object} GraphQL mutation fields.
 * @ignore
 */
const build_transactions_mutation_fields = (
  serialize_transaction_fields,
  abi_ast
) =>
  Object.keys(serialize_transaction_fields).length
    ? {
        serialize_transaction: {
          description: 'Serialise a list of transactions into `WASM` binary.',
          type: packed_transaction_type,
          args: {
            actions: {
              type: new GraphQLNonNull(
                new GraphQLList(
                  new GraphQLNonNull(
                    new GraphQLInputObjectType({
                      name: 'transactions_type',
                      fields: Object.keys(serialize_transaction_fields).reduce(
                        (acc, key) => ({
                          ...acc,
                          [key]: {
                            type: serialize_transaction_fields[key].args.actions
                              .type
                          }
                        }),
                        {}
                      )
                    })
                  )
                )
              )
            },
            configuration: {
              type: configuration_type
            }
          },
          async resolve(
            _,
            { actions, configuration = configuration_default_value },
            { rpc_url }
          ) {
            let _actions = []

            let _context_free_actions = []
            for (const action of actions) {
              const contract = Object.keys(action)[0]
              for await (const contract_actions of action[contract])
                for await (const contract_action_name of Object.keys(
                  contract_actions
                )) {
                  const { authorization, ...action_data } =
                    contract_actions[contract_action_name]
                  const data = await serialize_transaction_data({
                    actionType: contract_action_name,
                    data: action_data,
                    abi_ast: abi_ast[contract]
                  })
                  if (authorization)
                    _actions.push({
                      account: abi_ast[contract].contract,
                      action: contract_action_name,
                      authorization,
                      data
                    })
                  else
                    _context_free_actions.push({
                      account: abi_ast[contract].contract,
                      action: contract_action_name,
                      data
                    })
                }
            }

            const packed_transaction = await resolver(
              {
                configuration,
                actions: _actions,
                rpc_url,
                context_free_actions: _context_free_actions
              },
              abi_ast
            )

            return packed_transaction
          }
        }
      }
    : {}

module.exports = build_transactions_mutation_fields
