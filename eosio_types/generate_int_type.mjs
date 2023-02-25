import { GraphQLScalarType } from "graphql/index.mjs";

/**
 * Generates a GraphQL scalar signed integer type of size `bytes`.
 * @name generate_int_type
 * @param {number} bits Size of the integer.
 * @returns {GraphQLScalarType} GraphQL scalar integer type.
 */
function generate_int_type(bits) {
  bits = BigInt(bits);
  const max = 2n ** (bits - 1n) - 1n;
  const min = 2n ** (bits - 1n) * -1n;
  return new GraphQLScalarType({
    description: `\`Integer t${bits} type\`

Signed integer range is between ${min} - ${max}`,
    name: `int${bits.toString()}`,
    parseValue(int) {
      if (int == "") return "";
      int = BigInt(int);
      if (int > max || int < min)
        throw new RangeError(`Integer range is outside uint${bits}.`);
      return int.toString();
    }
  });
}

export default generate_int_type;
