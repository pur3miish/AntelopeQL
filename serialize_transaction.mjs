import { GraphQLList, GraphQLNonNull } from "graphql";

import public_key_type from "./eosio_types/public_key_type.mjs";
import configuration_type from "./graphql_input_types/configuration.mjs";
import packed_transaction_type from "./graphql_object_types/packed_transaction.mjs";
import mutation_resolver from "./mutation_resolver.mjs";

const serialize_transaction = (actions, ast_list) => ({
  description: "Serialize a list of actions into an atomic binary instruction.",
  type: new GraphQLNonNull(packed_transaction_type),
  args: {
    actions: {
      type: actions
    },
    configuration: {
      type: configuration_type
    },
    available_keys: {
      type: new GraphQLList(public_key_type)
    }
  },
  async resolve(_, { available_keys, ...args }, { network }) {
    const { transaction, ...serialized_txn } = await mutation_resolver(
      args,
      network,
      ast_list
    );

    return { ...serialized_txn, available_keys, transaction };
  }
});

export default serialize_transaction;
