'use strict'

/**
 * Creates a checksum WASM hex string.
 * @param {string} byte_string Hexadecimal string.
 * @param {20 | 32 | 64} bytes For checksum160, checksum256 and checksum512 respectively.
 * @returns {string} Checksum hex string.
 */
function checksum(byte_string, bytes) {
  if (!byte_string.match(/^[a-fA-F0-9]+$/gmu))
    throw new Error(
      `Invalid Checksum${bytes * 8} must only be characters [a-z0-9].`
    )
  if (byte_string.length > bytes * 2)
    throw new Error(`checksum${bytes * 8} hex string < ${bytes * 2}`)
  return byte_string.padStart(2, '00').padEnd(bytes * 2, '00')
}

module.exports = checksum
