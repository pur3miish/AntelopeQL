import { GraphQLNonNull } from "graphql/index.mjs";

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
    }
  },
  resolve(_, args, { network }) {
    return mutation_resolver(args, network, ast_list);
  }
});

export default serialize_transaction;
