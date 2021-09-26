'use strict'

const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLEnumType
} = require('graphql')
const name_type = require('../../../public/eos_types/name_type')
const get_table_by_scope = require('../../network/get_table_by_scope')

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
 * @param {Array} tables List of Table names.
 * @param {string} contract Name of smart contract.
 * @returns {object} table_entries field for GraphQL query.
 * @ignore
 */
function table_entries(tables, contract) {
  const prefix = contract.replace(/[.]+/gmu, '_')
  return {
    description: `Query the list of \`table entries\` on the ${contract} contract.`,
    type: new GraphQLObjectType({
      name: prefix + '_table_entry_data',
      fields: () => ({
        rows: {
          description: `List of objects \`table_entries\`.`,
          type: new GraphQLList(type)
        },
        more: {
          description: 'The next entry.',
          type: name_type
        }
      })
    }),
    args: {
      table: {
        description: 'Name of the smart contract table',
        type: new GraphQLEnumType({
          name: prefix + '_table_names',
          description:
            'Filter entires by table, if no table name is specified entries on all tables will be returned.',
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
      return get_table_by_scope(
        {
          code: contract,
          ...args
        },
        rpc_url
      )
    }
  }
}

module.exports = table_entries
