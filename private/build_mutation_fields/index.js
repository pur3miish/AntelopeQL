'use strict'

const {
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLList
} = require('graphql')
const serialize_transaction_data = require('../serialize/transaction_data.js')
const ast_to_input_types = require('./ast_to_input_types.js')
const authorization_type = require('./types/authorization_type.js')
const configuration_default_value = require('./types/configuration_default_value.js')
const configuration_type = require('./types/configuration_type.js')

/**
 * Builds a GraphQL mutation input field from an `abi ast`.
 * Think of this function as an interface between the incoming mutation and the serialization of the transaction into a WASM string that can either be
 * signed and broadcast to the EOSIO blockchain or you can just return the serialization type.
 * @name build_mutation_fields
 * @kind function
 * @param {object} abi_ast Abstract syntax tree (AST) for a given smart contract.
 * @param {Function} resolver A resolver for handling EOSIO transaction.
 * @param {object} type A GraphQL return type.
 * @returns {object} GraphQL mutation fields.
 * @ignore
 */
function build_mutation_fields(abi_ast, resolver, type) {
  const ast_input_object_types = ast_to_input_types(abi_ast)

  const fields = abi_ast.actions.reduce(
    (acc, { name, type, ricardian_contract }) => ({
      ...acc,
      [name]: {
        description: ricardian_contract,
        type: new GraphQLInputObjectType({
          name: abi_ast.gql_contract + '_' + name,
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
    [abi_ast.gql_contract]: {
      type,
      description: `Update the \`${abi_ast.contract}\` smart contract.`,
      args: {
        actions: {
          type: new GraphQLList(
            GraphQLNonNull(
              new GraphQLInputObjectType({
                name: `${abi_ast.gql_contract}_action`,
                description: `List of mutations on the ${abi_ast.contract} smart contract.`,
                fields
              })
            )
          )
        },
        configuration: {
          description:
            'An optional configuration object that controls various elements of a transaction.',
          type: configuration_type
        }
      },
      async resolve(
        _,
        { configuration = configuration_default_value, actions },
        { rpc_url, private_keys = [] }
      ) {
        let _actions = []
        let _context_free_actions = []

        for await (const action of actions) {
          const actions_data = Object.values(action)
          const action_key = Object.keys(action)
          let index = 0
          for await (const action of action_key) {
            const { authorization, ...action_data } = actions_data[index]
            const data = await serialize_transaction_data({
              actionType: action,
              data: action_data,
              abi_ast
            })

            if (authorization)
              _actions.push({
                account: abi_ast.contract,
                action,
                authorization,
                data
              })
            else
              _context_free_actions.push({
                account: abi_ast.contract,
                action,
                data
              })

            index++
          }
        }

        return resolver(
          {
            configuration,
            actions: _actions,
            rpc_url,
            private_keys,
            context_free_actions: _context_free_actions
          },
          abi_ast
        )
      }
    }
  }
}

module.exports = build_mutation_fields
