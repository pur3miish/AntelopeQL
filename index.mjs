import {
  execute,
  GraphQLError,
  GraphQLObjectType,
  GraphQLSchema,
  parse,
  Source,
  validate
} from "graphql";

import blockchain from "./blockchain/index.mjs";
import build_graphql_fields_from_abis from "./build_graphql_fields_from_abis.mjs";
import actions from "./graphql_input_types/actions.mjs";
import push_serialized_transaction from "./push_serialized_transaction.mjs";
import push_transaction from "./push_transaction.mjs";
import serialize_transaction from "./serialize_transaction.mjs";

/**
 * SmartQL for interacting with Antelope and EOSIO based blockchains.
 * @name smartql
 * @kind function
 * @param {Object} GraphQL [GraphQL.execute](https://graphql.org/graphql-js/execution/#:~:text=execute,-export%20function%20execute&text=Implements%20the%20%22Evaluating%20requests%22%20section,immediately%20explaining%20the%20invalid%20input.).
 * @param {String} GraphQL.query GraphQL query that will instruct SmartQL to perform a CRUD operation.
 * @param {*} [GraphQL.variableValues] GraphQL variables.
 * @param {String} [GraphQL.operationName] GraphQL operation name (query resolution).
 * @param {object} SmartQL SmartQL argument.
 * @param {Array<String>} [SmartQL.contracts] List of EOSIO/Antelope smart contracts.
 * @param {Array<String>} [SmartQL.private_keys] List of private keys.
 * @param {Object} network Network argument.
 * @param {function} network.fetch fetch implimentation.
 * @param {String} network.rpc_url Chain remote proceedure call (RPC) Uniform Resource Locator (URL) .
 * @param {Headers} [network.headers] Headers to pass to the network request.
 * @param {AbortSignal} [network.signal] Abort controller signal.
 * @example <caption>`Usage`</caption>
 * ```js
 * import smartql from 'smartql'
 * import fetch from 'node-fetch' // Your fetch implementation.
 *
 * const query = `{ eosio_token { accounts(arg: { scope: "relockeblock" }){ balance } } }`
 * const network = { fetch, rpc_url: 'https://eos.relocke.io', headers: { "content-type": "application/json" } } // connection configuration
 *
 * smartql({ query }, { contracts: ['eosio.token'] }, network).then(console.log)
 * ```
 * > Logged output was "data": {"eosio_token": {"accounts": [{"balance": "100.0211 EOS"}]}}}
 */
export default async function smartql(
  { query, variableValues, operationName },
  { contracts = [], private_keys = [] },
  network
) {
  try {
    const { fetch, rpc_url, ...fetchOptions } = network;

    const uri = `${rpc_url}/v1/chain/get_abi`;

    const abi_req = contracts.map((account_name) =>
      fetch(uri, {
        method: "POST",
        ...fetchOptions,
        body: JSON.stringify({
          account_name,
          json: true
        })
      }).then((req) => req.json())
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
      fields: { blockchain, ...query_fields }
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
        network,
        private_keys,
        ...fetchOptions
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
