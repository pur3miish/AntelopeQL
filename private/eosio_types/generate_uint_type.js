'use strict'
const { GraphQLScalarType } = require('graphql/type/definition.js')
/**
 * Generates a GraphQL scalar unsigend integer type of size `bits`.
 * @name generate_uint_type
 * @param {number} bits Size of the unint.
 * @returns {GraphQLScalarType} GraphQL scalar integer type.
 * @ignore
 */
function generate_uint_type(bits) {
  // https://github.com/amilajack/eslint-plugin-compat/issues/457
  // eslint-disable-next-line compat/compat
  const size = 2n ** BigInt(bits)
  return new GraphQLScalarType({
    description: `\`Unsigned integer${bits.toString()} type\`

Unsigned integer range is between 0 - ${size.toString()}`,
    name: `uint${bits}`,
    parseValue: uint => {
      if (uint === '') return ''

      // eslint-disable-next-line compat/compat
      uint = BigInt(uint)
      if (uint >= size || uint < 0n)
        throw new RangeError(`Integer range is outside uint${bits.toString()}.`)
      return uint.toString()
    }
  })
}

module.exports = generate_uint_type
