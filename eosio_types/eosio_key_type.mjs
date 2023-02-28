import { GraphQLInt, GraphQLObjectType } from "graphql";

import public_key_type from "./public_key_type.mjs";

const EOSIO_key_type = new GraphQLObjectType({
  name: "key_type",
  fields: () => ({
    key: { type: public_key_type },
    weight: { type: GraphQLInt }
  })
});

export default EOSIO_key_type;
