'use strict'
const { GraphQLScalarType } = require('graphql')

const symbol_code_type = new GraphQLScalarType({
  description: `\`Symbol code type\``,
  name: 'symbol_code',
  parseValue: symbol_code => {
    if (!symbol_code.match(/[A-Z]{1,7}/gmu))
      throw new Error('Invalid symbol code.')
    return symbol_code
  }
})

module.exports = symbol_code_type
