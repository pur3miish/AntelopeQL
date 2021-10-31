'use strict'

/**
 * Parses and transforms error into.
 * @param {Array<object> | object} errors Errors.
 * @returns {object} Error object
 */
function handleErrors(errors) {
  if (Array.isArray(errors))
    return {
      errors: errors.map(error => ({
        ...error,
        message: JSON.parse(error.message)
      }))
    }
  else if (errors.name == 'GraphQLError') return { errors: errors.toJSON() }
  else if (errors.name == 'SyntaxError') return { errors }
  else if (errors.name == 'TypeError' || errors.name == 'RangeError')
    return { errors: [{ message: errors.message }] }

  return { errors: JSON.parse(errors.message) }
}

module.exports = handleErrors
