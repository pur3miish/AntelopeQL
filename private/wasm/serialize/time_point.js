'use strict'
const uint = require('./uint')
const checkDateParse = require('./utils/checkDataParse.js')

/**
 * Serialises time point into WASM hex string.
 * @param {string} time_string ISO date.
 * @returns {string} hex string of the time.
 */
function time_point(time_string) {
  const dateToTimePoint = date => Math.round(checkDateParse(date + 'Z') * 1000)

  return uint(dateToTimePoint(time_string), 8)
}

module.exports = time_point
