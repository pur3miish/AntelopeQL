import {
  GraphQLError,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from "graphql";

import name_type from "../eosio_types/name_type.mjs";

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
    const {
      network: { fetch, rpc_url, ...fetchOptions }
    } = getContext(root, { account_name }, info);

    const uri = `${rpc_url}/v1/chain/get_raw_code_and_abi`;
    const data = await fetch(uri, {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify({
        account_name,
        code_as_wasm: 1
      })
    }).then((req) => req.json());

    if (data.error) throw new GraphQLError(data.message, { extensions: data });
    return data;
  }
};

export default get_smart_contract;
