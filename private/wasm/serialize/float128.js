'use strict'

/**
 * Validates a little endian float 128 hex string.
 * @param {string} f128 Hexacecimal representation of the float128.
 * @returns {string} Hexstring.
 */
function float128(f128) {
  if (typeof f128 != 'string')
    throw new TypeError('float128 needs to be hexstring.')

  if (!f128.match(/^[a-fA-F0-9]{32}$/gmu))
    throw new TypeError(
      'Float128 is expected to be a hexadecimal string of 32 characters long.'
    )
  return f128
}

module.exports = float128
