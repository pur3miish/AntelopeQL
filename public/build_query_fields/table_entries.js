'use strict'

const {
  GraphQLString,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLList,
  GraphQLObjectType
} = require('graphql')
const name_type = require('../eosio_types/name_type.js')
const get_table_by_scope = require('../network/get_table_by_scope.js')

const type = new GraphQLObjectType({
  name: 'table_entries_rows',
  description: 'List of table data.',
  fields: () => ({
    scope: {
      type: name_type,
      description: 'The account scope for the table.'
    },
    table: {
      type: name_type,
      description: 'EOS table name.'
    },
    payer: {
      type: name_type,
      description: 'RAM payer for the table data.'
    },
    count: { type: GraphQLInt, description: 'Number of matching items' }
  })
})

/**
 * Builds a GraphQL query field type for the EOSIO RPC call get_tables_by_scope.
 * @name table_entries
 * @kind function
 * @param {object} abi_ast ABI abstract syntax tree.
 * @returns {object} table_entries field for GraphQL query.
 * @ignore
 */
function table_scope(abi_ast) {
  const tables = abi_ast.tables.map(({ name }) => name)
  return {
    description: `Query entries by scope on the \`${abi_ast.contract}\`.`,
    type: new GraphQLObjectType({
      name: abi_ast.gql_contract + '_table_scope',
      fields: () => ({
        rows: {
          description: `List of objects \`table_scope\`.`,
          type: new GraphQLList(type)
        },
        more: {
          description: 'The next entry by scope.',
          type: name_type
        }
      })
    }),
    args: {
      table: {
        description: 'Filter scope queries by table',
        type: new GraphQLEnumType({
          name: abi_ast.gql_contract + '_table_name',
          description: `Selects the table to query by scope on the \`${abi_ast.contract}\` contract.`,
          values: tables.reduce(
            (acc, value) => ({
              ...acc,
              [value.replace(/[.]+/gmu, '_')]: { value }
            }),
            {}
          )
        })
      },
      lower_bound: {
        description:
          'Filters results to return the first element that is not less than provided `scope` in set.',
        type: GraphQLString
      },
      upper_bound: {
        description:
          'Filters results to return the first element that is greater than provided `scope` in set.',
        type: GraphQLString
      },
      limit: {
        type: GraphQLInt,
        description: 'Limit number of results returned.',
        defaultValue: 5
      }
    },
    async resolve(_, args, { rpc_url }) {
      const { error, ...data } = await get_table_by_scope(
        {
          code: abi_ast.contract,
          ...args
        },
        rpc_url
      )

      if (error) throw new Error(JSON.stringify(error))
      return data
    }
  }
}

module.exports = table_scope
