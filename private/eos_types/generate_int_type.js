'use strict'
const { GraphQLScalarType } = require('graphql/type/definition')
/**
 * Generates a GraphQL scalar signed integer type of size `bytes`.
 * @name generate_int_type
 * @param {number} bytes Size of the integer.
 * @returns {GraphQLScalarType} GraphQL scalar integer type.
 * @ignore
 */
function generate_int_type(bytes) {
  bytes = BigInt(bytes)
  const max = 2n ** (bytes - 1n)
  const min = 2n ** (bytes - 1n) - 1n
  // https://github.com/amilajack/eslint-plugin-compat/issues/457
  // eslint-disable-next-line
  return new GraphQLScalarType({
    description: `\`Integer t${bytes} type\`

Signed integer range is between ${min} - ${max}`,
    name: `int${bytes.toString()}`,
    parseValue: int => {
      if (int == '') return ''
      // eslint-disable-next-line
      int = BigInt(int)
      if (int > max || int < min)
        throw new RangeError(`Integer range is outside uint${bytes}.`)
      return int.toString()
    }
  })
}

module.exports = generate_int_type
