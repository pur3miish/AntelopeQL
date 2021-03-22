'use strict'
const fetch = require('isomorphic-fetch')

const controller = new AbortController()
const { signal } = controller

/**
 * Given a list of URLs recursively fetch and await for a specified duration.
 * @name rpc_call
 * @kind function
 * @param {Array} urls List of urls to call.
 * @param {object} body Fetch request data.
 * @param {number} duration No. milliseconds to wait before aborting.
 * @returns {object} Fetch response.
 * @ignore
 */
async function rpc_call(urls, body, duration = 40000) {
  let timeout = setTimeout(() => controller.abort(), duration)
  try {
    const request = await fetch(urls[0], {
      signal,
      ...body
    })

    clearTimeout(timeout)

    return request.json()
  } catch (err) {
    if (err.errno == 'ENOTFOUND')
      throw new Error(
        'We are having trouble talking to the blockchain, please check your internet connection.'
      )
    if (err.type == 'aborted') return rpc_call(urls.slice(1), body, duration)
    clearTimeout(timeout)
    if (!urls.length)
      throw new RangeError(
        'rpc_url can’t finish any of the requests the specified time too short.'
      )
    else throw new Error(err.message)
  }
}

module.exports = rpc_call
