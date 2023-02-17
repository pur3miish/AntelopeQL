import legacy_to_public_key from "eos-ecc/legacy_to_public_key.mjs";
import sign_packed_txn from "eos-ecc/sign_packed_txn.mjs";
import { GraphQLError, GraphQLNonNull } from "graphql";

import configuration_type from "./graphql_input_types/configuration.mjs";
import transaction_receipt from "./graphql_object_types/transaction_receipt.mjs";
import mutation_resolver from "./mutation_resolver.mjs";
import push_transaction_rpc from "./push_transaction_rpc.mjs";

const push_transaction = (actions, ast_list) => ({
  description:
    "Serialize a list of actions and push them to the blockchain in one step, requires private keys to be supplied to smartql.",
  type: new GraphQLNonNull(transaction_receipt),
  args: {
    actions: {
      type: actions
    },
    configuration: {
      type: configuration_type
    }
  },
  async resolve(_, args, { network, private_keys }) {
    const { chain_id, transaction_header, transaction_body, transaction } =
      await mutation_resolver(args, network, ast_list);

    const { default: get_public_key } = await import(
      "eos-ecc/public_key_from_private.mjs"
    );

    const available_keys = await Promise.all(
      private_keys.map((key) => get_public_key(key))
    );

    const key_pairs = {};
    available_keys.forEach((key, i) => (key_pairs[key] = private_keys[i]));

    const { fetch, rpc_url, ...fetchOptions } = network;

    if (!available_keys.length)
      throw new GraphQLError("No private keys found.");

    const { required_keys, ...errors } = await fetch(
      `${rpc_url}/v1/chain/get_required_keys`,
      {
        method: "POST",
        ...fetchOptions,
        body: JSON.stringify({
          available_keys,
          transaction
        })
      }
    ).then((res) => res.json());

    if (errors.message)
      throw new GraphQLError("No transaction sent", {
        extensions: errors
      });

    const signatures = await Promise.all(
      required_keys
        ?.map((key) => legacy_to_public_key(key))
        .map(async (key) => {
          return sign_packed_txn({
            chain_id,
            transaction_body,
            transaction_header,
            wif_private_key: key_pairs[await key]
          });
        })
    );

    return push_transaction_rpc(
      { transaction_body, transaction_header, signatures },
      network
    );
  }
});

export default push_transaction;
