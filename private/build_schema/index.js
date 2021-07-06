'use strict'
const { GraphQLSchema, GraphQLObjectType } = require('graphql')
const build_mutation_fields = require('./build_mutation_fields')
const query_fields = require('./build_query_fields')
/**
 * Builds a GraphQL schema from an EOS application binary interface (ABI) stored on a smart contract.
 * @name build_schema
 * @kind function
 * @param {object} ABI The Application binary interface for the EOS smart contract.
 * @param {string} smart_contract The name of the account’s smart contract.
 * @returns {object} GraphQL schema.
 * @ignore
 */
function build_schema(ABI, smart_contract) {
  if (!ABI)
    throw new TypeError(`Expected ABI to be object type but got ${typeof ABI}.`)

  const query = new GraphQLObjectType({
    name: 'Query',
    description: `Query the state of \`${smart_contract}\` smart contract.`,
    fields: query_fields(ABI)
  })

  const mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: `Update the state of the \`${smart_contract}\` smart contract.`,
    fields: build_mutation_fields(ABI)
  })

  return new GraphQLSchema({
    query,
    mutation,
    description: `SmartQL is a GraphQL implimentation for performing CRUD opperations on the EOS based Blockchains.`
  })
}

module.exports = build_schema
