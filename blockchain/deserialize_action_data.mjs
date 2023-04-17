import { GraphQLError, GraphQLNonNull, GraphQLString } from "graphql";

import bytes_type from "../eosio_types/bytes_type.mjs";
import name_type from "../eosio_types/name_type.mjs";

const deserialize_action_data = {
  description: "Returns a JSON object containing deserialized action data.",
  type: GraphQLString,
  args: {
    code: {
      description: "Account name that holds the Antelope smart contract.",
      type: new GraphQLNonNull(name_type)
    },
    action: {
      description: "Action name on the Antelope smart contract.",
      type: new GraphQLNonNull(name_type)
    },
    binargs: {
      description: "Serialized action data.",
      type: new GraphQLNonNull(bytes_type)
    }
  },
  async resolve(_, args, { network: { fetch, rpc_url, ...fetchOptions } }) {
    const uri = `${rpc_url}/v1/chain/abi_bin_to_json`;
    const req = await fetch(uri, {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify({
        ...args,
        json: true
      })
    });

    const data = await req.json();

    if (data.error) throw new GraphQLError(data.message, { extensions: data });
    return JSON.stringify(data.args);
  }
};

export default deserialize_action_data;
