import { GraphQLError } from "graphql";
/**
 * AntelopeQL Query resolver.
 * @param root GraphQL resolver root query
 * @param args Query arguments object
 * @param getContext Function returning the context object
 * @param info GraphQL resolver info object
 * @returns Data rows from the queried table
 */
export default async function query_resolver(root, args, getContext, info) {
    const { code } = root;
    const { arg } = args;
    const { network } = getContext(root, args, info);
    const { fetch, rpc_url, ...fetchOptions } = network;
    const { fieldName: query_name } = info;
    const table = query_name.replace(/_/g, ".");
    if (arg.key_type === "i256" ||
        arg.key_type === "ripemd160" ||
        arg.key_type === "sha256") {
        arg.encode_type = "hex";
        arg.lower_bound = arg.lower_bound ?? "00";
    }
    const uri = rpc_url + "/v1/chain/get_table_rows";
    const response = await fetch(uri, {
        method: "POST",
        ...fetchOptions,
        body: JSON.stringify({ json: true, code, table, ...arg })
    });
    const data = await response.json();
    if (data.error) {
        throw new GraphQLError(data.message, { extensions: data });
    }
    return data.rows;
}
//# sourceMappingURL=query_resolver.js.map