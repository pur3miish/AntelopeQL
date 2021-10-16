'use strict'
const { GraphQLScalarType } = require('graphql/type/definition.js')

const symbol_code_type = new GraphQLScalarType({
  description: `\`Symbol code type\`

  Includes the precision and the ticker.

  *Example* - 4,EOS
  `,
  name: 'symbol_code',
  parseValue: symbol_code => symbol_code
})

module.exports = symbol_code_type
