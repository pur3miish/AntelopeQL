'use strict'
const { GraphQLScalarType } = require('graphql')

const boolean_type = new GraphQLScalarType({
  description: '`Boolean type` true=1 or false=0',
  name: 'bool',
  parseValue: boolean => boolean,
  serialize: boolean => (boolean ? true : false)
})

module.exports = boolean_type
