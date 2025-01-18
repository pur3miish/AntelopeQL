import {
  execute,
  GraphQLError,
  GraphQLObjectType,
  GraphQLSchema,
  parse,
  Source,
  validate
} from "graphql";

import blockchain_query_field from "./blockchain_query_field.mjs";
import build_graphql_fields_from_abis from "./build_graphql_fields_from_abis.mjs";
import get_abis from "./get_abis.mjs";
import actions from "./graphql_input_types/actions.mjs";
import send_serialized_transaction from "./send_serialized_transaction.mjs";
import send_transaction from "./send_transaction.mjs";
import serialize_transaction from "./serialize_transaction.mjs";

/**
 * @typedef {Object} AntelopeQLArgument
 * @property {String} query  GraphQL query that will instruct AntelopeQL to perform a CRUD operation.
 * @property {String} rpc_url Chain remote proceedure call (RPC) Uniform Resource Locator (URL).
 * @property {*} [variableValues] GraphQL variables.
 * @property {String} [operationName] GraphQL operation name (query resolution).
 * @property {Array<String>} [contracts] List of Antelope smart contracts.
 * @property {async Function} [signTransaction] A function to sign the Antelope transaction.
 * @property {Headers} [headers] Headers to pass to the network request.
 * @property {AbortSignal} [signal] Abort controller signal.
 */

/**
 * @typedef {Object} AntelopeQLResult
 * @property {*} [data] returned data
 * @property {Array<*>} [errors] returned errors
 */

/**
 * AntelopeQL for interacting with Antelope based blockchains.
 * @param {AntelopeQLArgument} Argument
 * @returns {AntelopeQLResult}
 */
export default async function AntelopeQL({
  query,
  variableValues,
  operationName,
  signTransaction,
  contracts = [],
  ABIs = [],
  rpc_url,
  headers,
  signal
}) {
  try {
    if (!fetch)
      throw new GraphQLError("No fetch implementation found in global scope");

    const fetchOptions = {};
    if (headers) fetchOptions.headers = headers;
    if (signal) fetchOptions.signal = signal;

    const { mutation_fields, query_fields, ast_list } =
      build_graphql_fields_from_abis([
        ...ABIs,
        ...(await get_abis(contracts, { fetch, rpc_url, fetchOptions }))
      ]);

    const queries = new GraphQLObjectType({
      name: "Query",
      description: "Query table data from Antelope blockchains.",
      fields: { get_blockchain: blockchain_query_field, ...query_fields }
    });

    let mutations;

    if (Object.keys(mutation_fields).length) {
      const action_fields = actions(mutation_fields);
      mutations = new GraphQLObjectType({
        name: "Mutation",
        fields: {
          send_transaction: send_transaction(action_fields, ast_list),
          serialize_transaction: serialize_transaction(action_fields, ast_list),
          send_serialized_transaction
        }
      });
    } else
      mutations = new GraphQLObjectType({
        name: "Mutation",
        fields: {
          send_serialized_transaction
        }
      });

    const schema = new GraphQLSchema({
      query: queries,
      mutation: mutations
    });

    const document = parse(new Source(query));
    const queryErrors = validate(schema, document);
    if (queryErrors.length) return { errors: queryErrors };

    return execute({
      schema,
      document,
      rootValue: "",
      contextValue: () => ({
        network: { rpc_url, fetch, ...fetchOptions },
        signTransaction
      }),
      variableValues,
      operationName,
      fieldResolver(rootValue, args, ctx, { fieldName }) {
        return rootValue[fieldName];
      }
    });
  } catch (err) {
    return { errors: [err] };
  }
}
