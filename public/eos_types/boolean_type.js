'use strict'
const { GraphQLScalarType } = require('graphql')

const boolean_type = new GraphQLScalarType({
  description: `\`Boolean type\``,
  name: 'bool',
  parseValue: boolean => boolean
})

module.exports = boolean_type
