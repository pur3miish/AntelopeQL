'use strict'
const { GraphQLScalarType } = require('graphql/type/definition')

const symbol_code_type = new GraphQLScalarType({
  description: `\`Symbol code type\`

  Includes the precision and the ticker.

  *Example* - 4,EOS
  `,
  name: 'symbol_code',
  parseValue: symbol_code => {
    if (symbol_code == '') return ''
    if (!symbol_code.match(/^\d+,[A-Z]{1,7}$/gmu))
      throw new Error('Invald symbol code.')
    return symbol_code
  }
})

module.exports = symbol_code_type
