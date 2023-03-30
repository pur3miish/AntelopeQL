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
import actions from "./graphql_input_types/actions.mjs";
import push_serialized_transaction from "./push_serialized_transaction.mjs";
import push_transaction from "./push_transaction.mjs";
import serialize_transaction from "./serialize_transaction.mjs";

/**
 * @typedef {Object} AntelopeQLArgument
 * @property {String} query  GraphQL query that will instruct AntelopeQL to perform a CRUD operation.
 * @property {String} rpc_url Chain remote proceedure call (RPC) Uniform Resource Locator (URL).
 * @property {*} [variableValues] GraphQL variables.
 * @property {String} [operationName] GraphQL operation name (query resolution).
 * @property {Function} [fetch] Custom fetch implementation.
 * @property {Array<String>} [contracts] List of Antelope smart contracts.
 * @property {Array<String>} [private_keys] List of private keys used to sign transactions.
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
 * @example
 * ```js
 * import AntelopeQL from 'antelopeql/antelopeql.mjs'
 * import fetch from 'node-fetch'
 *
 * const query = `{ eosio_token { accounts(arg: { scope: "relockeblock" }){ balance } } }`
 *
 * AntelopeQL({
 *  query,
 *  contracts: ["eosio.token"],
 *  fetch,
 *  rpc_url: "https://eos.relocke.io",
 *  headers: { "content-type": "application/json" }
 * }).then(console.log);
 * ```
 * > Logged output was "data": {"eosio_token": {"accounts": [{"balance": "100.0211 EOS"}]}}}
 */

export default async function AntelopeQL({
  query,
  variableValues,
  operationName,
  fetch,
  contracts = [],
  private_keys = [],
  rpc_url,
  headers,
  signal
}) {
  try {
    if (!fetch && !(typeof window == "undefined")) fetch = window.fetch;
    if (!fetch && typeof window == "undefined")
      throw new GraphQLError("No fetch implementation provided");

    const fetchOptions = {};
    if (headers) fetchOptions.headers = headers;
    if (signal) fetchOptions.signal = signal;

    const uri = `${rpc_url}/v1/chain/get_abi`;

    const abi_req = contracts.map((account_name) =>
      fetch(uri, {
        method: "POST",
        ...fetchOptions,
        body: JSON.stringify({
          account_name,
          json: true
        })
      }).then((/** @type {{ json: () => any; }} */ req) => req.json())
    );

    const ABIs = await Promise.all(abi_req);
    for (let i = 0; i < contracts.length; i++) {
      if (ABIs[i].error)
        throw new GraphQLError(ABIs[i].message, { extensions: ABIs[i] });
      if (!ABIs[i].abi)
        throw new GraphQLError(
          `No smart contract found for “${contracts[i]}”.`
        );
    }

    const { mutation_fields, query_fields, ast_list } =
      build_graphql_fields_from_abis(ABIs);

    const queries = new GraphQLObjectType({
      name: "Query",
      description: "Query table data from EOSIO blockchain.",
      fields: { blockchain: blockchain_query_field, ...query_fields }
    });

    let mutations;

    if (Object.keys(mutation_fields).length) {
      const action_fields = actions(mutation_fields);
      mutations = new GraphQLObjectType({
        name: "Mutation",
        description: "Push transactions to the blockchain.",
        fields: {
          push_transaction: push_transaction(action_fields, ast_list),
          serialize_transaction: serialize_transaction(action_fields, ast_list),
          push_serialized_transaction
        }
      });
    } else
      mutations = new GraphQLObjectType({
        name: "Mutation",
        description: "Push transactions to the blockchain.",
        fields: {
          push_serialized_transaction
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
      contextValue: {
        network: { rpc_url, fetch, ...fetchOptions },
        private_keys
      },
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
