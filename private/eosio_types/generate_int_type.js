'use strict'
const { GraphQLScalarType } = require('graphql')
/**
 * Generates a GraphQL scalar signed integer type of size `bytes`.
 * @name generate_int_type
 * @param {number} bits Size of the integer.
 * @returns {GraphQLScalarType} GraphQL scalar integer type.
 * @ignore
 */
function generate_int_type(bits) {
  // https://github.com/amilajack/eslint-plugin-compat/issues/457
  // eslint-disable-next-line
  bits = BigInt(bits)
  const max = 2n ** (bits - 1n) - 1n
  const min = 2n ** (bits - 1n) * -1n
  return new GraphQLScalarType({
    description: `\`Integer t${bits} type\`

Signed integer range is between ${min} - ${max}`,
    name: `int${bits.toString()}`,
    parseValue: int => {
      if (int == '') return ''
      // eslint-disable-next-line
      int = BigInt(int)
      if (int > max || int < min)
        throw new RangeError(`Integer range is outside uint${bits}.`)
      return int.toString()
    }
  })
}

module.exports = generate_int_type
