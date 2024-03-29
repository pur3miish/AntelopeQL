import { GraphQLScalarType } from "graphql";

/**
 * Generates a GraphQL scalar type for checksum of `size`.
 * @name generate_int_type
 * @param {number} size Size of the checksum.
 * @returns {GraphQLScalarType} GraphQL scalar type.
 */
function generate_checksum(size) {
  return new GraphQLScalarType({
    description: `\`Checksum${8 * size} type\`

Represented as a hexadecimal string of ${2 * size} characters.
`,
    name: `checksum${size * 8}`,
    parseValue: (checksum) => checksum
  });
}

export default generate_checksum;
