import { GraphQLError, GraphQLNonNull, GraphQLString } from "graphql";

import { bytes_type } from "../antelope_types/bytes_type.js";
import { name_type } from "../antelope_types/name_type.js";

interface AbiBinToJsonArgs {
  code: string;
  action: string;
  binargs: string;
}

export interface Context {
  network(
    root: any,
    args: any,
    info: any
  ): {
    rpc_url: string | URL | Request;
    fetchOptions: RequestInit;
  };
  signTransaction?: (transaction: any) => Promise<any>;
}

export const abi_bin_to_json = {
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
  resolve: async (
    root: unknown,
    args: AbiBinToJsonArgs,
    context: Context,
    info: any
  ): Promise<string> => {
    const { rpc_url, fetchOptions } = context.network(root, args, info);

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

    if (data.error) {
      throw new GraphQLError(data.message, { extensions: data });
    }

    return JSON.stringify(data.args);
  }
};
