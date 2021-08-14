'use strict'
const {
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLInt
} = require('graphql')
const name = require('../../eos_types/name_type')
const get_table_rows = require('../../network/get_table_rows')
const abi_to_ast = require('../abi_to_ast/index.js.js')
const generate_table_scope = require('./table_scope')

const index_position_enum_type = new GraphQLEnumType({
  name: 'index_position_enum_type',
  values: {
    primary: { value: 'primary' },
    secondary: { value: 'secondary' },
    tertiary: { value: 'tertiary' },
    fourth: { value: 'fourth' },
    fifth: { value: 'fifth' },
    sixth: { value: 'sixth' },
    seventh: { value: 'seventh' },
    eighth: { value: 'eighth' },
    ninth: { value: 'ninth' },
    tenth: { value: 'tenth' }
  }
})

const table_row_arguments = {
  scope: {
    type: GraphQLNonNull(name),
    description: 'The account to which this data belongs.'
  },
  key_type: {
    type: GraphQLString,
    description:
      'Type of key specified by index_position (for example - uint64_t or name).'
  },
  index_position: {
    type: index_position_enum_type,
    description: 'Position of the index used.'
  },
  encode_type: {
    type: GraphQLString,
    description: 'encode type.'
  },
  upper_bound: {
    type: GraphQLString,
    description:
      'Filters results to return the first element that is greater than provided value in set.'
  },
  lower_bound: {
    type: GraphQLString,
    description:
      'Filters results to return the first element that is not less than provided value in set.'
  },
  limit: {
    type: GraphQLInt,
    description: 'Limit number of results returned.'
  }
}

/**
 * This function builds query fields of a GraphQL query of the Schema from an ABI of a given EOS smart contract.
 * Please see [graphql](https://graphql.org/learn/schema/) and [ABI](https://developers.eos.io/welcome/latest/getting-started/smart-contract-development/understanding-ABI-files).
 * @name build_query
 * @kind function
 * @param {object} ABI An ABI for a smart contract.
 * @returns {object} GraphQL query fields.
 * @ignore
 */
function build_query_fields(ABI) {
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
        description: `Query data from the table \`${Object.keys(item)[0]}\`.`,
        type: GraphQLList(item[Object.keys(item)[0]]),
        args: table_row_arguments,
        resolve: async (_, args, { rpc_url, contract }) => {
          args.table = Object.keys(item)[0]
          args.code = contract

          const { rows } = await get_table_rows(args, rpc_url)
          return rows
        }
      }
    }),
    {}
  )

  fields.ricardian_contract = {
    name: 'ricardian_contract_type',
    description: `Query ricardian contract for smart contract mutations.`,
    type: GraphQLString,
    args: {
      mutation_name: {
        type: new GraphQLEnumType({
          name: 'action_mutation',
          values: ABI.actions.reduce(
            (acc, { name }) => ({ ...acc, [name]: { value: name } }),
            {}
          )
        }),
        description: 'The name of the EOS action mutation.'
      }
    },
    resolve(_, { mutation_name }) {
      return ABI.actions.find(({ name }) => name == mutation_name)
        .ricardian_contract
    }
  }

  fields.table_scope = generate_table_scope(ABI.tables.map(({ name }) => name))

  return fields
}

module.exports = build_query_fields
