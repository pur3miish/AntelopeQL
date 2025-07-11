import { GraphQLInt, GraphQLObjectType, GraphQLFieldConfigMap } from "graphql";
import { public_key_type } from "./public_key_type.js";

export const Antelope_key_type = new GraphQLObjectType({
  name: "key_type",
  fields: (): GraphQLFieldConfigMap<any, any> => ({
    key: { type: public_key_type },
    weight: { type: GraphQLInt }
  })
});
