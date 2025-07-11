import {
  execute,
  GraphQLError,
  GraphQLObjectType,
  GraphQLSchema,
  parse,
  Source,
  validate,
  ExecutionResult
} from "graphql";

import blockchain_query_field from "./blockchain_query_field.js";
import build_graphql_fields_from_abis, {
  type AccountABI
} from "./build_graphql_fields_from_abis.js";
import get_abis from "./get_abis.js";
import actions from "./graphql_input_types/actions.js";
import send_serialized_transaction from "./send_serialized_transaction.js";
import send_transaction from "./send_transaction.js";
import serialize_transaction from "./serialize_transaction.js";
import { type SignTransactionContext } from "./types/Context.js";

export interface AntelopeQLArgument {
  query: string;
  variableValues?: Record<string, any>;
  operationName?: string;
  contracts?: string[];
  ABIs?: AccountABI[];
  signTransaction?: SignTransactionContext;
  rpc_url: string | URL | Request;
  fetchOptions?: RequestInit;
}

export interface AntelopeQLResult {
  data?: any;
  errors?: Array<GraphQLError>;
}

/**
 * AntelopeQL for interacting with Antelope-based blockchains.
 */
export default async function AntelopeQL({
  query,
  variableValues,
  operationName,
  signTransaction,
  contracts,
  ABIs,
  rpc_url,
  fetchOptions
}: AntelopeQLArgument): Promise<ExecutionResult> {
  try {
    const abis = (ABIs?.length ? ABIs : []) as AccountABI | any;

    const abi_from_contracts = await get_abis(contracts, {
      rpc_url,
      fetchOptions
    });

    abi_from_contracts.map((abi) => abis.push(abi));

    const { mutation_fields, query_fields, ast_list } =
      build_graphql_fields_from_abis(abis);

    const queries = new GraphQLObjectType({
      name: "Query",
      description: "Query table data from Antelope blockchains.",
      fields: { get_blockchain: blockchain_query_field, ...query_fields }
    });

    const action_fields = actions(mutation_fields);

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

    if (queryErrors.length > 0) return { errors: queryErrors };

    return execute({
      schema,
      document,
      rootValue: "",
      contextValue: {
        network: () => ({
          rpc_url,
          fetchOptions
        }),
        signTransaction
      },
      variableValues,
      operationName,
      fieldResolver(rootValue, args, ctx, { fieldName }) {
        return rootValue?.[fieldName];
      }
    });
  } catch (err) {
    console.log(err);

    return { errors: [err as GraphQLError] };
  }
}
