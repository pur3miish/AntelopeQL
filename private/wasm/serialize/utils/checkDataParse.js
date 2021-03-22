'use strict'
/**
 * Parse ISO date to `time_point`.
 * @param {string} date ISO Date.
 * @returns {number} `time_point`.
 */
const checkDateParse = date => {
  const result = Date.parse(date)
  if (Number.isNaN(result)) throw new Error('Invalid time format')

  return result
}

module.exports = checkDateParse
