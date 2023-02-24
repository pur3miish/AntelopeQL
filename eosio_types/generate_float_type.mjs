import { GraphQLScalarType } from "graphql";

/**
 * Generates a GraphQL scalar Float type of `size`.
 * @param {number} size Size of the float can be 32, 64 or 128.
 * @returns {GraphQLScalarType} GraphQL scalar float type.
 */
function generate_float_type(size) {
  return new GraphQLScalarType({
    description: `\`Float${size} type\``,
    name: `float${size}`,
    parseValue: (float) => float
  });
}

export default generate_float_type;
