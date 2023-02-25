import { GraphQLList, GraphQLNonNull } from "graphql/index.mjs";

import bytes_type from "./eosio_types/bytes_type.mjs";
import signature_type from "./eosio_types/signature_type.mjs";
import transaction_receipt from "./graphql_object_types/transaction_receipt.mjs";
import push_transaction_rpc from "./push_transaction_rpc.mjs";

/**
 * Push transaction type.
 */
const push_serialized_transaction = {
  description: "Pushes a serialized transaction to the blockchain.",
  type: new GraphQLNonNull(transaction_receipt),
  args: {
    transaction_header: { type: new GraphQLNonNull(bytes_type) },
    transaction_body: { type: new GraphQLNonNull(bytes_type) },
    signaures: { type: new GraphQLNonNull(new GraphQLList(signature_type)) }
  },
  resolve(_, args, ctx) {
    return push_transaction_rpc(args, ctx.network);
  }
};

export default push_serialized_transaction;
