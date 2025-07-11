import { GraphQLError, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import name_type from "../antelope_types/name_type.js";
const smart_contract_type = new GraphQLObjectType({
    name: "smart_contract_type",
    fields: () => ({
        wasm: {
            type: GraphQLString,
            description: "base64 encoded contract WASM"
        },
        abi: {
            description: "base64 encoded contract ABI",
            type: GraphQLString
        }
    })
});
const get_smart_contract = {
    description: "Retrieve a smart contract from the blockchain.",
    type: smart_contract_type,
    args: {
        account_name: {
            description: "The account holding the `smart contract`.",
            type: new GraphQLNonNull(name_type)
        }
    },
    async resolve(root, { account_name }, getContext, info) {
        const { network: { fetch, rpc_url, ...fetchOptions } } = getContext(root, { account_name }, info);
        const uri = `${rpc_url}/v1/chain/get_raw_code_and_abi`;
        const response = await fetch(uri, {
            method: "POST",
            ...fetchOptions,
            body: JSON.stringify({
                account_name,
                code_as_wasm: 1
            })
        });
        const data = await response.json();
        if (data.error)
            throw new GraphQLError(data.message || "Unknown error", {
                // Cast to satisfy the extensions type
                extensions: data
            });
        return data;
    }
};
export default get_smart_contract;
//# sourceMappingURL=get_smart_contract.js.map