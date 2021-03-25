'use strict'

/**
 * Serializes any unsigned integer (uint) to hexadecimal string.
 * @name uint
 * @kind function
 * @param {number | string | bigint} number the uint thta will be serialized
 * @param {number} bytes Number of bytes to place the uint into.
 * @returns {string} Hex string.
 * @ignore
 */
const uint = (number, bytes) => {
  // https://github.com/amilajack/eslint-plugin-compat/issues/457
  // eslint-disable-next-line compat/compat
  number = BigInt(number)

  if (number < BigInt(0)) throw new Error('expected a positive number')
  if (number > '0x'.padEnd(2 + bytes * 2, 'ff'))
    throw new Error(`uint “${number}” is too large for ${bytes} bytes`)
  const hexString = number.toString(16).padStart(bytes * 2, '0') // 2 nibble per byte
  return Buffer.from(hexString, 'hex').reverse().toString('hex')
}

module.exports = uint
