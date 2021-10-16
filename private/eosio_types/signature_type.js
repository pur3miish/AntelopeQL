'use strict'
const { GraphQLScalarType } = require('graphql/type/definition.js')

const signature_type = new GraphQLScalarType({
  description: `\`Signature type\`

  EOS K1 signature supported.`,
  name: 'signature',
  parseValue: signature => {
    if (signature == '') return ''
    if (typeof signature !== 'string')
      throw new Error('Expected signature to be string')
    const prefix = signature.substr(0, 7)
    if (prefix != 'SIG_K1_')
      throw new Error('Signature prefix is should be SIG_K1_.')
    return signature
  }
})

module.exports = signature_type
