'use strict'

/**
 * Parses and transforms error into.
 * @param {Array<object> | object} errors Errors.
 * @returns {object} Error object
 */
function handleErrors(errors) {
  if (!errors) return

  try {
    return {
      errors: errors.map(error => ({
        ...error,
        message: (() => {
          try {
            return JSON.parse(error.message)
          } catch (err) {
            return error.message
          }
        })()
      }))
    }
  } catch (err) {
    return { errors: [{ message: 'Internal server error.' }] }
  }
}

module.exports = handleErrors
