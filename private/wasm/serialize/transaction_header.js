'use strict'

const varuint32 = require('./varuint32.js')

const serialize_uint = uint => {
  let hex = uint.toString('16')
  if (hex.length % 2) hex = `0${hex}`
  return hex
}

const serialize_uint_LE = uint =>
  serialize_uint(uint)
    .match(/.{1,2}/gmu)
    .reverse()
    .join()
    .replace(/,/gmu, '')

/**
 * Serializes EOS transaction header
 * @param {object} arg Argument object.
 * @param {number} arg.expiration Transaction expiration.
 * @param {number} arg.ref_block_num Reference block number.
 * @param {number} arg.ref_block_prefix Reference block prefix.
 * @param {number} arg.max_net_usage_words Maximum allowed network bandwidth the txn can consume.
 * @param {number} arg.max_cpu_usage_ms Maximum allowed CPU bandwidth the txn can consume.
 * @param {number} arg.delay_sec txn delay seconds.
 * @returns {string} WASM hex string of serialized transaction header.
 */
const serialize_transaction_header = ({
  expiration,
  ref_block_num,
  ref_block_prefix,
  max_net_usage_words,
  max_cpu_usage_ms,
  delay_sec
}) =>
  serialize_uint_LE(expiration) +
  serialize_uint_LE(ref_block_num) +
  serialize_uint_LE(ref_block_prefix) +
  varuint32(max_net_usage_words) +
  serialize_uint(max_cpu_usage_ms) +
  varuint32(delay_sec)

module.exports = serialize_transaction_header
