'use strict'
const { base58_to_binary } = require('base58-js')
const { GraphQLScalarType } = require('graphql')
const ripemd160 = require('ripemd160-js')

const public_key_type = new GraphQLScalarType({
  description: `\`Public key type\`
  ---

  EOS public keys should begin with EOS and include base58 characters only.
  `,
  name: 'public_key',
  async parseValue(public_key) {
    if (public_key == '') return ''
    if (!public_key.startsWith('EOS'))
      throw new TypeError('Public key should start with EOS')

    const whole = base58_to_binary(public_key.replace('EOS', ''))
    const raw_public_key = whole.slice(0, -4)
    const checksum = whole.slice(-4)

    const hash = await ripemd160(raw_public_key)
    hash.slice(0, 4).forEach((i, x) => {
      if (i != checksum[x]) throw new RangeError('Invalid public key checksum.')
    })

    return public_key
  }
})

module.exports = public_key_type
