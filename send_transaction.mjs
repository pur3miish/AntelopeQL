import { GraphQLNonNull } from "graphql";
import sha256 from "universal-sha256-js/sha256.mjs";

import configuration_type from "./graphql_input_types/configuration.mjs";
import transaction_receipt from "./graphql_object_types/transaction_receipt.mjs";
import mutation_resolver from "./mutation_resolver.mjs";
import send_transaction_rpc from "./send_transaction_rpc.mjs";

const send_transaction = (actions, ast_list) => ({
  description:
    "Serialize a list of actions and push them to the blockchain in one step, requires private keys to be supplied to AntelopeQL.",
  type: new GraphQLNonNull(transaction_receipt),
  args: {
    actions: {
      type: actions
    },
    configuration: {
      type: configuration_type
    }
  },
  async resolve(_, args, { network, signTransaction }) {
    const { chain_id, transaction_header, transaction_body, transaction } =
      await mutation_resolver(args, network, ast_list);

    const transaction_bytes =
      chain_id +
      transaction_header +
      transaction_body +
      "0000000000000000000000000000000000000000000000000000000000000000";

    const hash_to_sign = await sha256(
      Uint8Array.from(
        transaction_bytes
          .match(/[a-fA-F0-9]{2}/gmu)
          .map((i) => Number(`0x${i}`))
      )
    );

    const signatures = await signTransaction(hash_to_sign, {
      serilaised_txn: {
        chain_id,
        transaction_header,
        transaction_body
      },
      transaction
    });

    return send_transaction_rpc(
      { transaction_body, transaction_header, signatures },
      network
    );
  }
});

export default send_transaction;
