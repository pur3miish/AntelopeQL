// @ts-ignore
import serializeName from "eosio-wasm-js/name.js";
import { GraphQLEnumType, GraphQLError, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import name_type from "../antelope_types/name_type.js";
function convertNameToSymbol(scope) {
    return (serializeName(scope).match(/[0-9A-Fa-f]{2}/g) || [])
        .map((hex) => String.fromCharCode(parseInt(hex, 16)))
        .filter((x) => !!x.charCodeAt(0))
        .join("");
}
const table_rows_type = new GraphQLObjectType({
    name: "table_rows_type",
    fields: {
        scope: { type: name_type },
        table_name: {
            type: name_type,
            resolve: (parent) => parent.table
        },
        ram_payer: {
            type: name_type,
            description: "The account that pays for the data entries.",
            resolve: (parent) => parent.payer
        },
        count: {
            type: GraphQLString,
            description: "No. of entries in the table."
        }
    }
});
const table_type = new GraphQLObjectType({
    name: "table_type",
    fields: {
        rows: { type: new GraphQLList(table_rows_type) },
        more: { type: name_type }
    }
});
const scopeTypeEnum = new GraphQLEnumType({
    name: "scope_type",
    values: {
        name: { value: 0 },
        symbol_code: { value: 1 }
    }
});
const get_table = {
    description: "Retrieve a table from the blockchain.",
    type: table_type,
    args: {
        account_name: {
            description: "The account name of the `smart contract`.",
            type: new GraphQLNonNull(name_type)
        },
        table_name: {
            description: "The table name on the smart contract.",
            type: name_type
        },
        limit: {
            description: "Limit number of results returned (how many items to return).",
            type: GraphQLInt,
            defaultValue: 10
        },
        lower_bound: {
            description: "Filters results to return the first element that is not less than provided value in the table.",
            type: GraphQLString
        },
        upper_bound: {
            description: "Filters results to return the first element that is greater than provided value in the table.",
            type: GraphQLString
        },
        scope_type: {
            defaultValue: 0,
            type: scopeTypeEnum
        }
    },
    async resolve(root, { account_name, table_name, limit = 10, lower_bound, upper_bound, scope_type = 0 }, getContext, info) {
        const { network: { fetch, rpc_url, ...fetchOptions } } = getContext(root, { account_name, table_name, limit, lower_bound, upper_bound }, info);
        const uri = `${rpc_url}/v1/chain/get_table_by_scope`;
        const res = await fetch(uri, {
            method: "POST",
            ...fetchOptions,
            body: JSON.stringify({
                code: account_name,
                table: table_name,
                limit,
                lower_bound,
                upper_bound,
                json: true,
                show_payer: true
            })
        });
        const data = (await res.json());
        if (data.error)
            throw new GraphQLError(data.message || "Unknown error", {
                extensions: data
            });
        if (scope_type === 1) {
            return {
                ...data,
                rows: data.rows.map((x) => ({
                    ...x,
                    scope: convertNameToSymbol(x.scope)
                }))
            };
        }
        return data;
    }
};
export default get_table;
//# sourceMappingURL=get_table_by_scope.js.map