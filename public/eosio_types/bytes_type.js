'use strict'

const { GraphQLScalarType } = require('graphql')

const bytes_type = new GraphQLScalarType({
  description: 'Hexedecimal text string type.',
  name: 'bytes',
  parseValue: bytes => {
    if (bytes == '') return bytes
    if (!bytes.match(/^[A-Fa-f0-9]+$/gmu))
      throw new TypeError('Invald hexadecimal string: ' + bytes)
    if (bytes.length % 2 != 0)
      throw new TypeError('Invalid Hexadecimal string length')

    return bytes
  }
})

module.exports = bytes_type
