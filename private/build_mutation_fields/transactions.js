'use strict'
const {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')
const broadcast_resolver = require('../resolvers/broadcast.js')
const resolver = require('../resolvers/index.js')
const serialize_transaction_data = require('../serialize/transaction_data.js')
const configuration_default_value = require('./types/configuration_default_value.js')
const configuration_type = require('./types/configuration_type.js')
const packed_transaction_type = require('./types/packed_transaction_type.js')
const transaction_receipt_type = require('./types/transaction_receipt_type.js')

/**
 * Generate mutation fields that can handle atomic transactions accross multiple smart contracts (1 -> x).
 * @kind function
 * @name build_transactions_mutation_fields
 * @param {object} contract_mutation_fields List of smart contract mutation fields
 * @param {Array<object>} abi_ast List of abstract syntax tree (AST) of the corresponding application binary interface‘s (ABI).
 * @param {bool} broadcast Determines if the transaction is pushed to the blockchain or just packed.
 * @returns {object} GraphQL mutation fields.
 * @ignore
 */
const build_transactions_mutation_fields = (
  contract_mutation_fields,
  abi_ast,
  broadcast
) =>
  Object.keys(contract_mutation_fields).length
    ? {
        transactions: {
          description:
            'Perform a series of atomic transactions across multiple smart `EOSIO` smart contracts (1 -> x).',
          type: broadcast ? transaction_receipt_type : packed_transaction_type,
          args: {
            actions: {
              type: new GraphQLList(
                new GraphQLNonNull(
                  new GraphQLInputObjectType({
                    name: 'transactions_type',
                    fields: Object.keys(contract_mutation_fields).reduce(
                      (acc, key) => ({
                        ...acc,
                        [key]: {
                          type: contract_mutation_fields[key].args.actions.type
                        }
                      }),
                      {}
                    )
                  })
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
            { rpc_url, private_keys = [] }
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
                private_keys,
                context_free_actions: _context_free_actions
              },
              abi_ast
            )

            if (broadcast)
              return broadcast_resolver({
                ...packed_transaction,
                private_keys,
                rpc_url
              })
            else return packed_transaction
          }
        }
      }
    : {}

module.exports = build_transactions_mutation_fields
