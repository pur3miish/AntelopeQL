// https://github.com/amilajack/eslint-plugin-compat/issues/457
/* eslint-disable compat/compat */
'use strict'
const uint = require('./uint')

/**
 * Serializes any signed integer (uint) to hexadecimal code.
 * @name int
 * @kind function
 * @param {number | string | bigint} number A signed integer.
 * @param {number} bytes number of bytes to place the int into
 * @returns {string} Hexstring
 * @ignore
 */
const int = (number, bytes = 1) => {
  number = BigInt(number)
  let signed
  // negative numbers
  if (number.toString().slice(0, 1) == '-') signed = true

  const max = BigInt('0x7f'.padEnd(2 + bytes * 2, 'ff'))
  const min = BigInt('0x80'.padEnd(2 + bytes * 2, '00'))
  const andGate = BigInt('0xff'.padEnd(2 + bytes * 2, 'ff'))

  if (number > max) throw new RangeError('Signed int too large.')
  if (number < -min) throw new RangeError('Signed int too small.')
  if (signed) return uint(number & andGate, bytes)
  return uint(number, bytes)
}

module.exports = int
