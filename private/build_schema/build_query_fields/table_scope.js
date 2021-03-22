'use strict'

const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLBoolean
} = require('graphql')
const name_type = require('../../eos_types/name')
const get_table_by_scope = require('../../network/get_table_by_scope')

const type = new GraphQLObjectType({
  name: 'table_scope',
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
 * @name table_scope
 * @kind function
 * @param {Array} tables List of Table names.
 * @returns {object} table_scope field for GraphQL query.
 * @ignore
 */
function table_scope(tables) {
  return {
    description: 'Query data from table by `scope`.',
    type: new GraphQLObjectType({
      name: 'table_scope_type',
      fields: () => ({
        rows: {
          description: 'List of objects `table_scope`.',
          type: new GraphQLList(type)
        },
        more: {
          description: 'The next scope in the `table_scope` rows array.',
          type: name_type
        }
      })
    }),
    args: {
      table: {
        description: 'Name of the smart contract table',
        type: new GraphQLEnumType({
          name: 'table_options',
          description: 'Select one of the possible tables to query by scope.',
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
      },
      reverse: {
        type: GraphQLBoolean,
        description: 'Reverse the order of returned results.'
      }
    },
    async resolve(_, args, { rpc_urls, contract }) {
      return get_table_by_scope(
        {
          code: contract,
          ...args
        },
        rpc_urls
      )
    }
  }
}

module.exports = table_scope
