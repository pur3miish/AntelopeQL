import { GraphQLScalarType } from "graphql";
/**
 * Generates a GraphQL scalar unsigend integer type of size `bits`.
 * @name generate_uint_type
 * @param {number} bits Size of the unint.
 * @returns {GraphQLScalarType} GraphQL scalar integer type.
 * @ignore
 */
function generate_uint_type(bits) {
  const size = 2n ** BigInt(bits);
  return new GraphQLScalarType({
    description: `\`Unsigned integer${bits.toString()} type\`

Unsigned integer range is between 0 - ${size.toString()}`,
    name: `uint${bits}`,
    parseValue(uint) {
      if (uint === "") return "";

      uint = BigInt(uint);
      if (uint >= size || uint < 0n)
        throw new RangeError(
          `Integer range is outside uint${bits.toString()}.`
        );
      return uint.toString();
    }
  });
}

export default generate_uint_type;
