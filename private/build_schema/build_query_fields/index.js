'use strict'
const { GraphQLString, GraphQLList } = require('graphql')
const get_table_rows = require('../../network/get_table_rows')
const abi_to_ast = require('../abi_to_ast/index.js')
const query_argument_fields = require('./query_argument_fields.js')
const generate_table_entries = require('./table_entries.js')

/**
 * This function builds query fields of a GraphQL query of the Schema from an ABI of a given EOS smart contract.
 * Please see [graphql](https://graphql.org/learn/schema/) and [ABI](https://developers.eos.io/welcome/latest/getting-started/smart-contract-development/understanding-ABI-files).
 * @name build_query
 * @kind function
 * @param {object} ABI An ABI for a smart contract.
 * @param {string} contract name of the smart contract.
 * @returns {object} GraphQL query fields.
 * @ignore
 */
function build_query_fields(ABI, contract) {
  if (!ABI.tables || !ABI.tables.length)
    return {
      noquery: {
        description: 'This smart contract has no tables to query.',
        type: GraphQLString
      }
    }

  const prefix = contract.replace(/[.]+/gmu, '_') + '_'
  const { ast_object_types } = abi_to_ast(ABI, prefix)

  const fields = ast_object_types.reduce((acc, item) => {
    return {
      ...acc,
      [String(Object.values(item)[0]).replace(prefix, '')]: {
        description: `Query data from \`${Object.keys(item)[0]}\` table.`,
        type: GraphQLList(item[Object.keys(item)[0]]),
        args: {
          arg: {
            name: 'argument_type',
            type: query_argument_fields
          }
        },
        resolve: async (_, { arg }, { rpc_url }) => {
          const table_arg = {
            code: contract,
            table: Object.keys(item)[0],
            ...arg
          }
          const { rows } = await get_table_rows(table_arg, rpc_url)
          return rows
        }
      }
    }
  }, {})

  fields.table_entries = generate_table_entries(
    ABI.tables.map(({ name }) => name),
    contract
  )

  return fields
}

module.exports = build_query_fields
