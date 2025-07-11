import { GraphQLError, GraphQLInputObjectType, GraphQLList, GraphQLString } from "graphql";
import bytes_type from "../antelope_types/bytes_type.js";
import name_type from "../antelope_types/name_type.js";
import public_key_type from "../antelope_types/public_key_type.js";
import authorization_type from "../graphql_input_types/authorization.js";
const action_type = new GraphQLInputObjectType({
    name: "required_keys_action",
    fields: {
        account: {
            type: name_type,
            description: "The smart contract name"
        },
        name: { type: name_type },
        authorization: { type: new GraphQLList(authorization_type) },
        data: { type: GraphQLString },
        hex_data: { type: bytes_type }
    }
});
const transaction_type = new GraphQLInputObjectType({
    name: "required_keys_transaction",
    fields: {
        expiration: { type: GraphQLString },
        ref_block_num: { type: GraphQLString },
        ref_block_prefix: { type: GraphQLString },
        max_net_usage_words: { type: GraphQLString },
        max_cpu_usage_ms: { type: GraphQLString },
        actions: { type: new GraphQLList(action_type) },
        context_free_actions: { type: GraphQLString }
    }
});
const get_required_keys = {
    description: "Retrieve the required keys for a transaction.",
    type: new GraphQLList(public_key_type),
    args: {
        transaction: {
            type: transaction_type
        },
        available_keys: {
            type: new GraphQLList(public_key_type)
        }
    },
    async resolve(root, { available_keys = [], transaction }, getContext, info) {
        const { network: { fetch, rpc_url, ...fetchOptions } } = getContext(root, { available_keys, transaction }, info);
        const uri = `${rpc_url}/v1/chain/get_required_keys`;
        if (!transaction) {
            throw new GraphQLError("Transaction argument is required.");
        }
        const { actions = [], ...txn } = transaction;
        const data = await fetch(uri, {
            method: "POST",
            ...fetchOptions,
            body: JSON.stringify({
                available_keys: await Promise.all(available_keys),
                transaction: {
                    ...txn,
                    actions: actions.map(({ data, ...object }) => ({
                        ...object,
                        ...(data ? { data: JSON.parse(data) } : {})
                    }))
                }
            })
        });
        const response = await data.json();
        if (response.error) {
            throw new GraphQLError(response.message || "Unknown error", {
                extensions: response.error
            });
        }
        return response.required_keys;
    }
};
export default get_required_keys;
//# sourceMappingURL=get_required_keys.js.map