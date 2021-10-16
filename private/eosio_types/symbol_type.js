'use strict'

const { GraphQLScalarType } = require('graphql/type/definition.js')

const symbol_type = new GraphQLScalarType({
  description: `\`Symbol type\`

---

An eosio symbol is an all uppercase string of 7 or less characters from [A-Z].

  ### Symbol rules

  - Ends with a symbol up to 7 characters long
  - Symbol must be uppercase
  - Maximum value (2^62 - 1)
  - Maximum decimal precision of 18

  `,
  name: 'symbol',
  parseValue: symbol => symbol
})

module.exports = symbol_type
