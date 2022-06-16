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
  let request = {}
  try {
    request = await fetch(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
      ...body
    })
  } catch (err) {
    request = { url }
    request.statusText = err.message
  }

  if (String(request.status).startsWith('2')) return request.json()

  let message = {
    message: `request to ${request.url} failed, reason: ${request.statusText}`,
    blockchain: {}
  }

  try {
    message.blockchain = await request.json()
  } catch (err) {
    // catch error if no .json object on errror.
  }

  throw new Error(JSON.stringify(message))
}

module.exports = rpc_call
