'use strict'

const uint = require('./uint.js')
const checkDateParse = require('./utils/checkDataParse.js')

/**
 * Convert date in ISO format to `time_point_sec` (seconds since epoch) WASM string.
 * @param {string} time_string ISO date.
 * @returns {string} seconds since epoch.
 */
function time_point_sec(time_string) {
  return uint(Math.round(checkDateParse(time_string + 'Z') / 1000), 4)
}

module.exports = time_point_sec
