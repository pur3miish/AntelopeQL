'use strict'
const { GraphQLScalarType } = require('graphql')
/**
 * Generates a GraphQL scalar Float type of `size`.
 * @name generate_float_type
 * @param {number} size Size of the float can be 32, 64 or 128.
 * @returns {GraphQLScalarType} GraphQL scalar float type.
 * @ignore
 */
function generate_float_type(size) {
  return new GraphQLScalarType({
    description: `\`Float${size} type\``,
    name: `float${size}`,
    parseValue: float => float
  })
}

module.exports = generate_float_type
