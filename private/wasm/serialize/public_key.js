'use strict'

const { base58_to_binary } = require('base58-js')
const ripemd160 = require('ripemd160-js')

/**
 * Serilaises EOS WIF public key to WASM hex string.
 * @name public_key
 * @kind function
 * @param {string} wif_public_key EOS public key in WIF.
 * @returns {Promise} Resolves to a hex string if valid WIF key is supplied.
 * @ignore
 */
async function public_key(wif_public_key) {
  if (!wif_public_key.startsWith('EOS'))
    throw new Error('Expected WIF key to start with EOS')

  const K1_type = '00'
  const decoded_key = base58_to_binary(wif_public_key.slice(3))
  const checksum = decoded_key.slice(-4)
  const raw_key = decoded_key.slice(0, 33)
  const hash_of_key = await ripemd160(raw_key)
  checksum.forEach((i, x) => {
    if (i != hash_of_key[x]) throw new Error('Invalid public key checksum.')
  })

  return Array.from(raw_key).reduce(
    (acc, x) => (acc += x.toString('16').padStart(2, '00')),
    K1_type
  )
}

module.exports = public_key
