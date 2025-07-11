import { GraphQLList, GraphQLNonNull } from "graphql";
import bytes_type from "./antelope_types/bytes_type.js";
import signature_type from "./antelope_types/signature_type.js";
import transaction_receipt from "./graphql_object_types/transaction_receipt.js";
import send_transaction_rpc from "./send_transaction_rpc.js";
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
    resolve(root, args, context, info) {
        const { network } = context;
        return send_transaction_rpc(args, network);
    }
};
export default send_serialized_transaction;
//# sourceMappingURL=send_serialized_transaction.js.map