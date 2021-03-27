'use strict'

const { GraphQLScalarType } = require('graphql')

const varuint32_type = new GraphQLScalarType({
  description: `\`varuint32\`

  A LEB128 variable-length integer, limited to 32 bits (i.e., the values [0, 2^32-1]), represented by at most ceil(32/7) bytes that may contain padding 0x80 bytes.
  `,
  name: 'varuint32',
  parseValue: varuint32 => varuint32
})

module.exports = varuint32_type
