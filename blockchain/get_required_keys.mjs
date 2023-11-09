import {
  GraphQLError,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLString
} from "graphql";

import bytes_type from "../eosio_types/bytes_type.mjs";
import name_type from "../eosio_types/name_type.mjs";
import public_key_type from "../eosio_types/public_key_type.mjs";
import authorization_type from "../graphql_input_types/authorization.mjs";

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
  description: "Retrieve a table from the blockchain.",
  type: new GraphQLList(public_key_type),
  args: {
    transaction: {
      type: transaction_type
    },
    available_keys: {
      type: new GraphQLList(public_key_type)
    }
  },
  async resolve(
    _,
    { available_keys, transaction },
    { network: { fetch, rpc_url } }
  ) {
    const uri = `${rpc_url}/v1/chain/get_required_keys`;

    const { actions, ...txn } = transaction;

    const data = await fetch(uri, {
      method: "POST",
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

    const { required_keys, ...error } = await data.json();
    if (error.error)
      throw new GraphQLError(error.message, {
        extensions: error.error
      });

    return required_keys;
  }
};

export default get_required_keys;
