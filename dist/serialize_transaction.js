import { GraphQLList, GraphQLNonNull } from "graphql";
import public_key_type from "./antelope_types/public_key_type.js";
import configuration_type from "./graphql_input_types/configuration.js";
import packed_transaction_type from "./graphql_object_types/packed_transaction.js";
import mutation_resolver from "./mutation_resolver.js";
const serialize_transaction = (actions, // type of actions GraphQL input
ast_list // AST type, adjust as needed
) => ({
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
    async resolve(root, { available_keys, ...args }, getContext, info) {
        const { network } = getContext(root, { available_keys, ...args }, info);
        const { transaction, ...serialized_txn } = await mutation_resolver(args, network, ast_list);
        return { ...serialized_txn, available_keys, transaction };
    }
});
export default serialize_transaction;
//# sourceMappingURL=serialize_transaction.js.map