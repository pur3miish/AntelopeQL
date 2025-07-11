import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLFieldConfig,
  GraphQLResolveInfo
} from "graphql";

import bytes_type from "./antelope_types/bytes_type.js";
import signature_type from "./antelope_types/signature_type.js";
import transaction_receipt from "./graphql_object_types/transaction_receipt.js";
import send_transaction_rpc from "./send_transaction_rpc.js";

interface SendSerializedTransactionArgs {
  transaction_header: any; // type for bytes_type — adjust if you have a specific type
  transaction_body: any; // same here
  signatures: any[]; // array of signature_type instances (adjust if you have a better type)
}

interface Context {
  network: {
    fetch: typeof fetch;
    rpc_url: string;
    [key: string]: any;
  };
}

/**
 * Push transaction type.
 */
const send_serialized_transaction: GraphQLFieldConfig<
  any, // source/root type (usually unused here)
  any, // context type
  SendSerializedTransactionArgs
> = {
  description: "Sends a serialized transaction to the blockchain.",
  type: new GraphQLNonNull(transaction_receipt),
  args: {
    transaction_header: { type: new GraphQLNonNull(bytes_type) },
    transaction_body: { type: new GraphQLNonNull(bytes_type) },
    signatures: { type: new GraphQLNonNull(new GraphQLList(signature_type)) }
  },
  resolve(
    root: any,
    args: SendSerializedTransactionArgs,
    context: Context,
    info: GraphQLResolveInfo
  ) {
    const { network } = context;
    return send_transaction_rpc(args, network);
  }
};

export default send_serialized_transaction;
