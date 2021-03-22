'use strict'

/**
 * Serialises a EOS name into a WASM hex string.
 * @name name
 * @kind function
 * @param {string} name_string EOS name string.
 * @returns {string} hex string.
 * @ignore
 */
function name(name_string) {
  if (name_string == '') return '0000000000000000'
  if (!name_string.match(/^[.1-5a-z]{1,12}[.1-5a-j]?$/gmu))
    throw new Error('Invalid name.')

  /**
   * Converts a-z and 1 - 5 ascii code to symbol code.
   * @param {number} c ascii character code.
   * @returns {number} symbol code
   */
  const charToSymbol = c =>
    c >= 97 && c <= 122 ? c - 91 : c >= 49 && c <= 53 ? c - 48 : 0

  return new Uint8Array(
    name_string
      .match(/.{1}/gu)
      .map(i => charToSymbol(i.charCodeAt()))
      .reduce(
        ({ bit, array }, curr) => {
          if (bit < 5) curr *= 2
          for (let j = 4; j >= 0; --j)
            if (bit >= 0) {
              array[Math.floor(bit / 8)] |= ((curr >> j) & 1) << bit % 8
              --bit
            }

          return { bit, array }
        },
        { bit: 63, array: new Array(8).fill(0) }
      ).array
  ).reduce((acc, i) => (acc += i.toString(16).padStart(2, '00')), '')
}

module.exports = name
