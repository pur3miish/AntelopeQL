import { GraphQLList, GraphQLNonNull } from "graphql";

import bytes_type from "./eosio_types/bytes_type.mjs";
import signature_type from "./eosio_types/signature_type.mjs";
import transaction_receipt from "./graphql_object_types/transaction_receipt.mjs";
import send_transaction_rpc from "./send_transaction_rpc.mjs";

/**
 * Push transaction type.
 */
const send_serialized_transaction = {
  description: "Sends a serialized transaction to the blockchain.",
  type: new GraphQLNonNull(transaction_receipt),
  args: {
    transaction_header: { type: new GraphQLNonNull(bytes_type) },
    transaction_body: { type: new GraphQLNonNull(bytes_type) },
    signatures: { type: new GraphQLNonNull(new GraphQLList(signature_type)) }
  },
  resolve(root, args, getContext, info) {
    const { network } = getContext(root, args, info);
    return send_transaction_rpc(args, network);
  }
};

export default send_serialized_transaction;
