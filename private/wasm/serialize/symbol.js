'use strict'

/**
 * Serilaises a symbol string to a WASM hex string.
 * @name symbol
 * @kind function
 * @param {string} symbol_string To be serialised.
 * @returns {string} Hex string.
 * @ignore
 */
function symbol(symbol_string) {
  if (!symbol_string.match(/^\d+,[A-Z]{1,7}/gmu))
    throw new TypeError('Symbol string should be in the format “1,SYMBOL”')

  let [precision, name] = symbol_string.split(',')
  name = name.trim().toUpperCase()
  if (name.length > 7)
    throw new TypeError('Symbol name must be 1 - 7 uppercase characters.')
  if (parseInt(precision) > 18) throw new RangeError('Precision must be < 19.')

  return (
    parseInt(precision.trim()).toString('16').padStart(2, '0') +
    name
      .match(/[A-Z]/gmu)
      .reduce((acc, i) => (acc += i.charCodeAt().toString('16')), '')
      .padEnd(14, '00')
  )
}

module.exports = symbol
