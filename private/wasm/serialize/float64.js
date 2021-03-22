'use strict'

/**
 * Serialises a float64 to a WASM hex string.
 * @param {number | string} f64 float64 to be serialised.
 * @returns {string} Hex string.
 */
function float64(f64) {
  return [...new Uint8Array(Float64Array.of(f64).buffer)].reduce(
    (acc, i) => (acc += i.toString('16').padStart(2, '00')),
    ''
  )
}

module.exports = float64
