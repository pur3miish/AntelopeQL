'use strict'
const {
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType
} = require('graphql')
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

  const { ast_object_types } = abi_to_ast(ABI)

  const fields = ast_object_types.reduce(
    (acc, item) => ({
      ...acc,
      [`${Object.values(item)[0]}`]: {
        description: `Query data from \`${Object.keys(item)[0]}\` table.`,
        type: GraphQLList(item[Object.keys(item)[0]]),
        args: {
          arg: {
            type: new GraphQLInputObjectType({
              name: `${item[Object.keys(item)[0]]}_arg`,
              fields: query_argument_fields(item[Object.keys(item)[0]])
            })
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
    }),
    {}
  )

  /*
   * We create this prefix to to give an graphql fields unique names specific to the smart contract.
   * this prevents any GraphQL Duplicate errors being thrown.
   * Moreover and EOSIO account names with periods need to be transformed into _ as periods are invalid graphql chars.
   */
  const contract_name_prefix = contract.replace(/[.]+/gmu, '_')

  // Transforms the field names to be specific to the contract which will prevent graphql throwing a possible duplicate type error.
  // Remove any periods from the contract name, “eosio.token” as periods are not valid graphql name type.
  const new_fields = Object.keys(fields).reduce((acc, name) => {
    if (fields[name].type.ofType)
      fields[
        name
      ].type.ofType.name = `${contract_name_prefix}_${fields[name].type.ofType.name}`
    return {
      ...acc,
      [`${contract_name_prefix}_${name}`]: fields[name]
    }
  }, {})

  new_fields.table_entries = generate_table_entries(
    ABI.tables.map(({ name }) => name),
    contract
  )

  return new_fields
}

module.exports = build_query_fields
