'use strict'
const fetch = require('isomorphic-fetch')

/**
 * RPC call with error handle.
 * @name rpc_call
 * @kind function
 * @param {string} url RPC url.
 * @param {object} body Fetch request data.
 * @returns {object} Fetch response.
 * @ignore
 */
async function rpc_call(url, body) {
  try {
    const request = await fetch(url, body)
    return request.json()
  } catch (err) {
    if (err.errno == 'ENOTFOUND')
      throw new Error(
        'We are having trouble talking to the blockchain, please check your internet connection.'
      )
  }
}

module.exports = rpc_call
