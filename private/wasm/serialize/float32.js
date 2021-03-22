'use strict'

/**
 * Serialises a float32 to a WASM hex string.
 * @param {number | string} f32 Float32 to be serialised.
 * @returns {string} Hex string.
 */
function float32(f32) {
  return [...new Uint8Array(Float32Array.of(f32).buffer)].reduce(
    (acc, i) => (acc += i.toString('16').padStart(2, '00')),
    ''
  )
}

module.exports = float32
