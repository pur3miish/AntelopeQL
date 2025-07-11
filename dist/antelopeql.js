import { execute, GraphQLError, GraphQLObjectType, GraphQLSchema, parse, Source, validate } from "graphql";
import blockchain_query_field from "./blockchain_query_field.js";
import build_graphql_fields_from_abis from "./build_graphql_fields_from_abis.js";
import get_abis from "./get_abis.js";
import actions from "./graphql_input_types/actions.js";
import send_serialized_transaction from "./send_serialized_transaction.js";
import send_transaction from "./send_transaction.js";
import serialize_transaction from "./serialize_transaction.js";
/**
 * AntelopeQL for interacting with Antelope-based blockchains.
 */
export default async function AntelopeQL({ query, variableValues, operationName, signTransaction, contracts = [], ABIs = [], rpc_url, headers, signal }) {
    try {
        if (typeof fetch !== "function") {
            throw new GraphQLError("No fetch implementation found in global scope");
        }
        const fetchOptions = {};
        if (headers)
            fetchOptions.headers = headers;
        if (signal)
            fetchOptions.signal = signal;
        const { mutation_fields, query_fields, ast_list } = build_graphql_fields_from_abis([
            ...ABIs,
            ...(await get_abis(contracts, { fetch, rpc_url, fetchOptions }))
        ]);
        const queries = new GraphQLObjectType({
            name: "Query",
            description: "Query table data from Antelope blockchains.",
            fields: { get_blockchain: blockchain_query_field, ...query_fields }
        });
        const action_fields = actions(mutation_fields);
        const mutations = new GraphQLObjectType({
            name: "Mutation",
            fields: {
                send_transaction: send_transaction(action_fields, ast_list),
                serialize_transaction: serialize_transaction(action_fields, ast_list),
                send_serialized_transaction
            }
        });
        const schema = new GraphQLSchema({
            query: queries,
            mutation: mutations
        });
        const document = parse(new Source(query));
        const queryErrors = validate(schema, document);
        if (queryErrors.length > 0)
            return { errors: queryErrors };
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
                return rootValue?.[fieldName];
            }
        });
    }
    catch (err) {
        return { errors: [err] };
    }
}
//# sourceMappingURL=antelopeql.js.map