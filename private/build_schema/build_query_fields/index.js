'use strict'
const {
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLInputObjectType
} = require('graphql')
const get_table_rows = require('../../network/get_table_rows')
const abi_to_ast = require('../abi_to_ast/index.js.js')
const generate_table_entries = require('./table_entries')

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
        description: `Query data from \`${Object.keys(item)[0]}\` table.`,
        type: GraphQLList(item[Object.keys(item)[0]]),
        args: {
          arg: {
            type: new GraphQLInputObjectType({
              name: `${item[Object.keys(item)[0]]}_arg`,
              fields: () => ({
                scope: {
                  type: GraphQLString,
                  description: `The scope within the \`${
                    item[Object.keys(item)[0]]
                  }\`table to query data from.`,
                  defaultValue: ''
                },
                index_position: {
                  type: index_position_enum_type,
                  description: 'Position of the index used.',
                  defaultValue: 'primary'
                },
                key_type: {
                  type: GraphQLString,
                  description: `The key type of \`index_position\`; primary only supports i64. All others support i64, i128, i256, float64, float128, ripemd160, sha256. Special type name indicates an account name`
                },
                encode_type: {
                  type: GraphQLString,
                  description:
                    'The encoding type of `key_type` dec for decimal encoding of (i[64|128|256], float[64|128]); hex for hexadecimal encoding of (i256, ripemd160, sha256).'
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
                  description: 'The maximum number of items to return'
                }
              })
            })
          }
        },
        resolve: async (_, { arg }, { rpc_url, contract }) => {
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

  fields.table_entries = generate_table_entries(
    ABI.tables.map(({ name }) => name)
  )

  return fields
}

module.exports = build_query_fields
