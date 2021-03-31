'use strict'
const fetch = require('isomorphic-fetch')

/**
 * Given a list of URLs recursively fetch and await for a specified duration.
 * @name rpc_call
 * @kind function
 * @param {Array} urls List of urls to call.
 * @param {object} body Fetch request data.
 * @returns {object} Fetch response.
 * @ignore
 */
async function rpc_call(urls, body) {
  try {
    const request = await fetch(urls[0], body)
    return request.json()
  } catch (err) {
    if (err.errno == 'ENOTFOUND')
      throw new Error(
        'We are having trouble talking to the blockchain, please check your internet connection.'
      )
  }
}

module.exports = rpc_call
