import {
  GraphQLError,
  GraphQLInputObjectType,
  GraphQLObjectType
} from "graphql";

import {
  eosio_abi_to_graphql_ast,
  get_graphql_fields_from_AST
} from "./eosio_abi_to_graphql_ast.mjs";

/** @typedef {import("./types.mjs").ABI} ABI */

/**
 * @typedef AccountABI
 * @type {Object}
 * @property {ABI} abi
 * @property {String} account_name
 */

/**
 * Builds GraphQL query and mutation fields from a list of ABIs. These GraphQL fields can readily be consumed by a GraphQL Schema, enabling developers the ability to integrate a varienty of EOSIO based blockchains into their GraphQL service.
 * @param {Array<AccountABI>} abi_list Argument.
 * @returns {Object} AntelopeQL fields.
 * @example <caption>`Usage` in a custom GraphQL API.</caption>
 * ```js
 * import actions_type from 'antelopeql/graphql_input_types/actions.js'
 * import serialize_transaction from 'antelopeql/graphql_input_types/actions.js'
 * import push_transaction from 'antelopeql/push_transaction.js'
 *
 * const network = { fetch, rpc_url: 'https://eos.relocke.io', headers: {}, signal }
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
 *   contextValue: { network },
 *   fieldResolver(rootValue, args, ctx, { fieldName }) {
 *     return rootValue[fieldName]
 *   }
 * })
 * ```
 */
export default function build_graphql_fields_from_abis(abi_list) {
  const contract_query_fields = {};
  const contract_mutation_fields = {};
  const ast_list = {};

  for (const { abi, account_name } of abi_list) {
    const name = account_name.replace(/\./gmu, "_");
    const AST = eosio_abi_to_graphql_ast(abi);

    ast_list[name] = AST; // For use in serializing data in mutation resolver.
    const { query_fields, mutation_fields } = get_graphql_fields_from_AST(
      AST,
      abi,
      name
    );

    if (Object.keys(query_fields).length)
      contract_query_fields[name] = {
        name,
        type: new GraphQLObjectType({
          name: name + "_query",
          fields: query_fields
        }),
        resolve(__, _, { network: { rpc_url, fetch } = {} }, { fieldName }) {
          if (!fetch)
            throw new GraphQLError(
              "No fetch argument found on the context of the GraphQL.execute."
            );

          if (!rpc_url)
            throw new GraphQLError(
              "No rpc_url argument found on the context of the GraphQL.execute."
            );

          return { code: fieldName.replace(/_/gmu, ".") };
        }
      };

    if (Object.keys(mutation_fields).length)
      contract_mutation_fields[name] = {
        type: new GraphQLInputObjectType({
          name,
          fields: mutation_fields
        })
      };
  }

  return {
    query_fields: contract_query_fields,
    mutation_fields: contract_mutation_fields,
    ast_list
  };
}
