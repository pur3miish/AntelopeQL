'use strict'
const { GraphQLObjectType, GraphQLSchema } = require('graphql')
const abi_to_ast = require('./abi_to_ast.js')
const build_mutation_fields = require('./build_mutation_fields/index.js')
const build_query_fields = require('./build_query_fields/index.js')

/**
 * Builds a GraphQL schema from an EOS application binary interface (ABI).
 * @name build_schema
 * @kind function
 * @param {object} ABI EOSIO ABI for a given smart contract.
 * @param {string} contract The name of the account’s holding the smart contract.
 * @returns {object} GraphQL schema.
 * @param {bool} broadcast Push the transaction to the blockchain, else return serialized transaction.
 * @ignore
 */
function build_schema(ABI, contract, broadcast) {
  if (!ABI)
    throw new TypeError(`Expected ABI to be object type but got ${typeof ABI}.`)

  const abi_ast = abi_to_ast(ABI, contract)

  const query = new GraphQLObjectType({
    name: 'Query',
    description: `Query the state of \`${contract}\` smart contract.`,
    fields: build_query_fields(abi_ast)
  })

  let mutation

  mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: `Update the state of the \`${contract}\` smart contract.`,
    fields: build_mutation_fields(abi_ast, broadcast)
  })

  return new GraphQLSchema({
    query,
    mutation
  })
}

module.exports = build_schema
