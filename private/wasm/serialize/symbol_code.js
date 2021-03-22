'use strict'

/**
 * Serilaises a symbol code to a WASM hex string.
 * @name symbol
 * @kind function
 * @param {string} symbol_code_string To be serialised.
 * @returns {string} Hex string.
 * @ignore
 */
function symbol_code(symbol_code_string) {
  if (!symbol_code_string.match(/^[A-Z]{1,7}$/gmu))
    throw new TypeError('Invalid symbol code string.')

  return symbol_code_string
    .match(/[A-Z]/gmu)
    .reduce((acc, i) => (acc += i.charCodeAt().toString('16')), '')
    .padEnd(16, '00')
}

module.exports = symbol_code
