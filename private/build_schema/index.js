'use strict'
const { GraphQLSchema, GraphQLObjectType } = require('graphql')
const build_mutation_fields = require('./build_mutation_fields')
const build_query_fields = require('./build_query_fields')

/**
 * Builds a GraphQL schema from an EOS application binary interface (ABI) stored on a smart contract.
 * @name build_schema
 * @kind function
 * @param {object} ABI The Application binary interface for the EOS smart contract.
 * @param {string} contract The name of the account’s smart contract.
 * @returns {object} GraphQL schema.
 * @param {bool} broadcast Push the transaction to blockchain, else return serialized transaction.
 * @ignore
 */
function build_schema(ABI, contract, broadcast) {
  if (!ABI)
    throw new TypeError(`Expected ABI to be object type but got ${typeof ABI}.`)

  const query = new GraphQLObjectType({
    name: 'Query',
    description: `Query the state of the \`${contract}\` smart contract.`,
    fields: build_query_fields(ABI, contract)
  })

  const mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: `Update the state of the \`${contract}\` smart contract.`,
    fields: build_mutation_fields(ABI, contract, broadcast)
  })

  return new GraphQLSchema({
    query,
    mutation,
    description: `SmartQL is a GraphQL implimentation for performing CRUD opperations on the EOSIO based Blockchains.`
  })
}

module.exports = build_schema
