import { GraphQLScalarType } from "graphql";

const boolean_type = new GraphQLScalarType({
  description: "`Boolean type` true=1 or false=0",
  name: "bool",
  parseValue: (boolean) => boolean,
  serialize: (boolean) => (boolean ? true : false)
});

export default boolean_type;
