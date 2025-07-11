import { GraphQLError, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import name_type from "../antelope_types/name_type.js";
import symbol_code_type from "../antelope_types/symbol_code_type.js";
const currency_stats_type = new GraphQLObjectType({
    name: "currency_stats_type",
    fields: () => ({
        supply: {
            type: GraphQLString
        },
        max_supply: {
            type: GraphQLString
        },
        issuer: {
            type: name_type
        }
    })
});
const get_currency_stats = {
    description: "Retrieve currency stats.",
    type: currency_stats_type,
    args: {
        code: {
            type: new GraphQLNonNull(name_type)
        },
        symbol: {
            type: new GraphQLNonNull(symbol_code_type)
        }
    },
    async resolve(root, args, getContext, info) {
        const { symbol, ...restArgs } = args;
        const { network: { fetch, rpc_url, ...fetchOptions } } = getContext(root, { symbol, ...restArgs }, info);
        const uri = `${rpc_url}/v1/chain/get_currency_stats`;
        const req = await fetch(uri, {
            method: "POST",
            ...fetchOptions,
            body: JSON.stringify({
                symbol,
                json: true,
                ...restArgs
            })
        });
        const data = await req.json();
        if (data.error)
            throw new GraphQLError(data.message, { extensions: data });
        // Return data for the requested symbol
        return data[symbol];
    }
};
export default get_currency_stats;
//# sourceMappingURL=get_currency_stats.js.map