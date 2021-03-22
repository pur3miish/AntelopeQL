'use strict'
const uint = require('./uint.js')
const checkDateParse = require('./utils/checkDataParse.js')

/**
 * Convert date in ISO format to `block_timestamp_type` (half-seconds since a different epoch)
 * @param {string} time_String ISO date format.
 * @returns {string} hex string.
 */
function block_time_stamp(time_String) {
  return uint(
    Math.round((checkDateParse(time_String + 'Z') - 946684800000) / 500),
    4
  )
}

module.exports = block_time_stamp
