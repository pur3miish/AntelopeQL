'use strict'
const { GraphQLScalarType } = require('graphql/type/definition')

/**
 * Generates a GraphQL scalar unsigend integer type of size `bytes`.
 * @name generate_uint_type
 * @param {number} bytes Size of the unint.
 * @returns {GraphQLScalarType} GraphQL scalar integer type.
 * @ignore
 */
function generate_uint_type(bytes) {
  bytes = BigInt(bytes)
  // https://github.com/amilajack/eslint-plugin-compat/issues/457
  // eslint-disable-next-line compat/compat
  return new GraphQLScalarType({
    description: `\`Unsigned integer${bytes.toString()} type\`

Unsigned integer range is between 0 - ${2n ** bytes}`,
    name: `uint${bytes}`,
    parseValue: uint => {
      if (uint == '') return ''
      // eslint-disable-next-line compat/compat
      uint = BigInt(uint)
      if (uint > bytes || uint < 0n)
        throw new RangeError(
          `Integer range is outside uint${bytes.toString()}.`
        )
      return uint.toString()
    }
  })
}

module.exports = generate_uint_type
