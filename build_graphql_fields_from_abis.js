'use strict'

const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLError
} = require('graphql')
const {
  get_graphql_fields_from_AST,
  eosio_abi_to_graphql_ast
} = require('./eos_abi_to_graphql_ast.js')

/**
 * Builds GraphQL query and mutation fields from a list of ABIs. These GraphQL fields can readily be consumed by a GraphQL Schema, enabling developers the ability to integrate a varienty of Antelope based blockchains into their GraphQL service.
 * @name build_graphql_fields_from_abis
 * @kind function
 * @param {Array<object>} abi_list Argument.
 * @param {object} abi_list.abi Application binary interface (ABI) for the smart contract.
 * @param {string} abi_list.account_name The account name holding the smart contract.
 * @returns {object} SmartQL fields.
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const build_graphql_fields_from_abis = require('smartql/build_graphql_fields_from_abis')
 * ```
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import build_graphql_fields_from_abis from 'smartql/build_graphql_fields_from_abis'
 * ```
 * @example <caption>`Usage` in a vanilla GraphQL API.</caption>
 * ```js
 * import actions_type from 'smartql/graphql_input_types/actions.js'
 * import serialize_transaction from 'smartql/graphql_input_types/actions.js'
 * import push_transaction from 'smartql/push_transaction.js'
 *
 * const smartql_rpc = { fetch, rpc_url: 'https://eos.relocke.io' }
 * const ABI_list = [{ account_name: 'eosio.token', abi: … }]
 * const { mutation_fields, query_fields, ast_list } =
 *   build_graphql_fields_from_abis(ABI_list)
 *
 * // GraphQL query with `eosio.token` queries.
 * const queries = new GraphQLObjectType({
 *   name: 'Query',
 *   fields: query_fields
 * })
 *
 * const action_fields = actions_type(mutation_fields)
 *
 * // GraphQL mutation with `eosio.token` actions added.
 * const mutations = new GraphQLObjectType({
 *   name: 'Mutation',
 *   fields: {
 *     push_transaction: push_transaction(action_fields, ast_list),
 *     serialize_transaction: serialize_transaction(action_fields, ast_list),
 *     push_serialized_transaction
 *   }
 * })
 *
 * const schema = new GraphQLSchema({
 *   query: queries,
 *   mutation: mutations
 * })
 *
 * const document = parse(new Source(query)) // GraphQL document.
 *
 * return execute({
 *   schema,
 *   document,
 *   rootValue: '',
 *   contextValue: { smartql_rpc },
 *   fieldResolver(rootValue, args, ctx, { fieldName }) {
 *     return rootValue[fieldName]
 *   }
 * })
 * ```
 */
function build_graphql_fields_from_abis(abi_list) {
  const contract_query_fields = {}
  const contract_mutation_fields = {}
  const ast_list = {}

  for (const { abi, account_name } of abi_list) {
    const name = account_name.replace(/\./gmu, '_')
    const AST = eosio_abi_to_graphql_ast(abi)
    ast_list[name] = AST // For use in serializing data in mutation resolver.
    const { query_fields, mutation_fields } = get_graphql_fields_from_AST(
      AST,
      abi,
      name
    )

    contract_query_fields[name] = {
      name,
      type: new GraphQLObjectType({
        name: name + '_query',
        fields: query_fields
      }),
      resolve(__, _, { smartql_rpc: { rpc_url, fetch } = {} }, { fieldName }) {
        if (!fetch)
          throw new GraphQLError(
            'No fetch argument found on the context of the GraphQL.execute.'
          )

        if (!rpc_url)
          throw new GraphQLError(
            'No rpc_url argument found on the context of the GraphQL.execute.'
          )

        return { code: fieldName.replace(/_/gmu, '.') }
      }
    }

    contract_mutation_fields[name] = {
      type: new GraphQLInputObjectType({
        name,
        fields: mutation_fields
      })
    }
  }

  return {
    query_fields: contract_query_fields,
    mutation_fields: contract_mutation_fields,
    ast_list
  }
}

module.exports = build_graphql_fields_from_abis
