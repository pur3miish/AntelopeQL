'use strict'

const varuint32 = require('./varuint32.js')

/**
 * serialises string into a WASM hex string.
 * @param {string} str String
 * @returns {string} hex string.
 */
function serialise_string(str) {
  if (str === '') return '00'
  return (
    varuint32(str.length) +
    str
      .match(/./gmu)
      .reduce(
        (acc, i) => (acc += i.charCodeAt(0).toString('16').padStart(2, '00')),
        ''
      )
  )
}

module.exports = serialise_string
