'use strict'
const { GraphQLScalarType } = require('graphql/type/definition')
const serialize = require('../wasm/serialize/bytes.js')

const bytes_type = new GraphQLScalarType({
  description: '`Bytes type`',
  name: 'bytes',
  parseValue: bytes => {
    if (bytes == '') return bytes
    if (!bytes.match(/^[A-Fa-f0-9]+$/gmu))
      throw new Error('Invald hexadecimal string.')
    return serialize(bytes)
  }
})

module.exports = bytes_type
