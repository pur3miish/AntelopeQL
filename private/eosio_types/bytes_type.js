'use strict'
const serialize = require('eosio-wasm-js/public/serialize/bytes.js')
const { GraphQLScalarType } = require('graphql')

const bytes_type = new GraphQLScalarType({
  description: '`Bytes type`',
  name: 'bytes',
  parseValue: bytes => {
    if (bytes == '') return bytes
    if (!bytes.match(/^[A-Fa-f0-9]+$/gmu))
      throw new TypeError('Invald hexadecimal string: ' + bytes)
    return serialize(bytes)
  }
})

module.exports = bytes_type
