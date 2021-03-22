'use strict'
const base58_to_binary = require('base58-js/public/base58_to_binary')
const ripemd160 = require('ripemd160-js')

/**
 * Serialises an EOS signature to WASM hex string.
 * @name signature
 * @kind function
 * @param {string} sig_string EOS signature to be serilaised.
 * @returns {string} Hex string.
 * @ignore
 */
async function signature(sig_string) {
  if (!sig_string.startsWith('SIG_K1_'))
    throw new Error('Invalid signature format, must start with “SIG_K1_”')

  const signature_as_bin = base58_to_binary(sig_string.replace('SIG_K1_', ''))
  const K1 = [75, 49] // K1 as ascii
  const raw_sig = signature_as_bin.slice(0, -4)
  const hash = await ripemd160(new Uint8Array([...raw_sig, ...K1]))

  hash.slice(0, 4).forEach((x, i) => {
    if (x != signature_as_bin.slice(-4)[i])
      throw new Error('Invalid signature checksum.')
  })

  const key_type = {
    k1: '00',
    r1: '01',
    wa: '02'
  }

  return raw_sig.reduce(
    (acc, i) => (acc += i.toString(16).padStart(2, '00')),
    key_type.k1
  )
}

module.exports = signature
