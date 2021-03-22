'use strict'

/**
 * Serialises a varuint32 number to a WASM hex string.
 * @kind function
 * @name varuint32
 * @param {number} number Unsigned variable-length integer, 32 bits.
 * @param {Array} [buffer] Recursion transformation for the LEB128 type.
 * @returns {string} Varuint32 hexadecimal string.
 * @ignore
 */
function varuint32(number, buffer = []) {
  return number >>> 7
    ? varuint32(number >>> 7, [...buffer, 0x80 | (number & 0x7f)])
    : buffer
        .concat(number)
        .reduce((acc, i) => (acc += i.toString(16).padStart(2, '00')), '')
}

module.exports = varuint32
