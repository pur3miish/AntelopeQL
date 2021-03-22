'use strict'
const { GraphQLScalarType } = require('graphql/type/definition')

/**
 * Generates a GraphQL scalar type for checksum of `size`.
 * @name generate_int_type
 * @param {number} size Size of the checksum.
 * @returns {GraphQLScalarType} GraphQL scalar type.
 * @ignore
 */
function generate_checksum(size) {
  return new GraphQLScalarType({
    description: `\`Checksum${8 * size} type\`

Represented as a hexadecimal string of ${2 * size} characters.
`,
    name: `checksum${size * 8}`,
    parseValue: checksum => {
      if (checksum == '') return checksum
      if (checksum.length !== size * 2)
        throw new Error('Invalid checksum length.')
      if (!checksum.match(/^[A-Fa-f0-9]+$/gmu))
        throw new Error('Invald hexadecimal string.')
      return checksum
    }
  })
}

module.exports = generate_checksum
